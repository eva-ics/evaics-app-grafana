import pluginJson from "./plugin.json";

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;

export enum ROUTES {
  Main = "main",
  DS = "ds",
  Help = "help"
}

export enum DataSourceName {
  EVAICS = "EVA ICS"
}
export enum DataSourceType {
  EVAICS = "bohemiaautomation-evaics-datasource"
}
export enum DashboardUri {
  Overview = "d/d2362a28-87bd-4081-b94c-c663fea8227b/eva-ics-overview"
}
