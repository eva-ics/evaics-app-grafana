import React, { ChangeEvent } from "react";
import { InlineField, Input, SecretInput } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { EvaDataSourceOptions, EvaSecureJsonData } from "../types";

interface Props
  extends DataSourcePluginOptionsEditorProps<EvaDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const onUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      url: event.target.value
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value
      }
    });
  };

  const onResetAPIKey = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: ""
      }
    });
  };

  const { jsonData, secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData || {}) as EvaSecureJsonData;

  return (
    <div className="gf-form-group">
      <InlineField label="HMI URL" labelWidth={12}>
        <Input
          onChange={onUrlChange}
          value={jsonData.url || ""}
          placeholder="http://host:port"
          width={40}
        />
      </InlineField>
      <InlineField label="API key" labelWidth={12}>
        <SecretInput
          isConfigured={
            (secureJsonFields && secureJsonFields.apiKey) as boolean
          }
          value={secureJsonData.apiKey || ""}
          placeholder="API key"
          width={40}
          onReset={onResetAPIKey}
          onChange={onAPIKeyChange}
        />
      </InlineField>
    </div>
  );
}
