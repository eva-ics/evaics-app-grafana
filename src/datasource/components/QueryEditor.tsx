import React, { ChangeEvent } from "react";
import { InlineField, TextArea } from "@grafana/ui";
import { QueryEditorProps } from "@grafana/data";
import { DataSource } from "../datasource";
import { EvaDataSourceOptions, EvaQuery } from "../types";

type Props = QueryEditorProps<DataSource, EvaQuery, EvaDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTextChange = (event: ChangeEvent<any>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const { queryText } = query;

  return (
    <div className="gf-form">
      <InlineField label="Query Text" labelWidth={16} tooltip="">
        <TextArea
          onChange={onQueryTextChange}
          cols={80}
          rows={5}
          value={queryText || ""}
        />
      </InlineField>
    </div>
  );
}
