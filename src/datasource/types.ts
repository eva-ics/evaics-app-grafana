import {
  DataQuery,
  DataSourceJsonData,
  DataSourceInstanceSettings,
} from "@grafana/data";

export interface EvaQuery extends DataQuery {
  queryText: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface EvaDataSourceOptions extends DataSourceJsonData {
  url?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface EvaSecureJsonData {
  apiKey?: string;
}

//data source list types
export interface GlobalSettings {}

export interface EvaIcsDataSourceOptions extends DataSourceJsonData {
  url: number;
}

export interface EvaIcsDataSourceInstanceSettings
  extends DataSourceInstanceSettings<EvaIcsDataSourceOptions> {
  commands: string[];
}

export interface EvaIcsQuery extends DataQuery {
  query?: string;
  type?: string;
  command?: string;
  section?: string;
  cli?: boolean;
}
