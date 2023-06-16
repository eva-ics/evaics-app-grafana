import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType
} from "@grafana/data";

import { getBackendSrv } from "@grafana/runtime";

import { EvaQuery, EvaDataSourceOptions } from "./types";

export class DataSource extends DataSourceApi<EvaQuery, EvaDataSourceOptions> {
  url: string;
  hmi_url: string;
  call_id: number;

  constructor(
    instanceSettings: DataSourceInstanceSettings<EvaDataSourceOptions>
  ) {
    super(instanceSettings);
    this.url = instanceSettings.url || "";
    let hmi_url = instanceSettings.jsonData.url || "";
    this.hmi_url = hmi_url.replace(/\/+$/, "");
    this.call_id = 1;
  }

  async query(options: DataQueryRequest<EvaQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    let from;
    if (range && range.from) {
      from = range.from.valueOf() / 1000;
    } else {
      from = null;
    }
    let to;
    if (range && range.from) {
      to = range.to.valueOf() / 1000;
    } else {
      to = null;
    }

    const data: MutableDataFrame[] = [];
    for (const target of options.targets) {
      let q = target.queryText;
      if (!q) {
        continue;
      }
      q = q
        .replaceAll("${from}", from === null ? "null" : from.toString())
        .replaceAll("${to}", to === null ? "null" : to.toString())
        .replaceAll("\n", " ");
      if (q.startsWith("ehmi ")) {
        q = q + ` hmi_url=${this.hmi_url} uid=${options.dashboardUID}`;
      }
      try {
        if (q.startsWith("h ") || q.startsWith("item.state_history ")) {
          let payload: any = { q: `${q} t_start=${from} t_end=${to}` };
          let states = await this.call("call", payload);
          let fields = [];
          for (let [key, value] of Object.entries(states)) {
            let ft;
            if (key === "t") {
              value = (value as any).map((v: number) => v * 1000);
              ft = FieldType.time;
            } else {
              ft = FieldType.number;
            }
            fields.push({ name: key, values: value, type: ft });
          }
          let df = new MutableDataFrame({
            refId: target.refId,
            fields: fields as any
          });
          data.push(df);
        } else {
          let cols: any = [];
          let vals: any = {};
          function parse_record(record: object) {
            let first_rec = cols.length === 0;
            for (let [key, value] of Object.entries(record)) {
              let ft;
              if (key === "t" || key === "time") {
                if (Array.isArray(value)) {
                  value = (value as any).map((v: number) => v * 1000);
                } else {
                  value = value * 1000;
                }
              }
              if (first_rec) {
                if (key === "t" || key === "time") {
                  ft = FieldType.time;
                } else if (typeof value === "boolean") {
                  ft = FieldType.boolean;
                } else if (typeof value === "number") {
                  ft = FieldType.number;
                } else if (typeof value === "string") {
                  ft = FieldType.string;
                } else {
                  ft = FieldType.other;
                }
                cols.push([key, ft]);
              }
              if (vals[key]) {
                vals[key].push(value);
              } else {
                vals[key] = [value];
              }
            }
          }
          let result = await this.call("call", { q: q });
          if (Array.isArray(result)) {
            for (const d of result) {
              parse_record(d);
            }
          } else if (typeof result === "object") {
            parse_record(result);
          }
          let fields: any = [];
          for (const c of cols) {
            let key = c[0];
            let ft = c[1];
            fields.push({ name: key, values: vals[key], type: ft });
          }
          let df = new MutableDataFrame({
            refId: target.refId,
            fields: fields as any
          });
          data.push(df);
        }
      } catch (err: any) {
        throw new Error(`RPC error: ${err.message} (${err.code})`);
      }
    }
    return { data };
  }

  async testDatasource() {
    try {
      await this.call("test");
      return {
        status: "success",
        message: "Success"
      };
    } catch (err: any) {
      return {
        status: "error",
        message: `RPC error: ${err.message || ""} (${err.code})`
      };
    }
  }

  async call(method: string, params: object = {}) {
    if (this.hmi_url.endsWith("/ui") || this.hmi_url.endsWith("/ui/")) {
      throw {
        code: -32602,
        message: "invalid URL (remove /ui suffix)"
      };
    }
    if (this.call_id > 4_294_967_295) {
      this.call_id = 1;
    } else {
      this.call_id += 1;
    }
    let call_id = this.call_id;
    let payload = {
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: call_id
    };
    let result;
    try {
      result = await getBackendSrv().post(
        this.url + "/jrpc",
        JSON.stringify(payload)
      );
    } catch (err: any) {
      throw {
        code: -32016,
        message: err!.data!.message || "Failed"
      };
    }
    if (result.jsonrpc !== "2.0") {
      throw {
        code: -32009,
        message: "invalid server JSON RPC version response"
      };
    }
    if (result.id !== call_id) {
      throw {
        code: -32009,
        message: "invalid server JSON RPC call id"
      };
    }
    if (result.error) {
      throw result.error;
    }
    return result.result;
  }
}
