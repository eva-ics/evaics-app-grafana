import { DataSourcePlugin } from "@grafana/data";
import { DataSource } from "./datasource";
import { ConfigEditor } from "./components/ConfigEditor";
import { QueryEditor } from "./components/QueryEditor";
import { EvaQuery, EvaDataSourceOptions } from "./types";

export const plugin = new DataSourcePlugin<
  DataSource,
  EvaQuery,
  EvaDataSourceOptions
>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
