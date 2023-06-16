import React, { useEffect, useState } from "react";
import { appIds } from "../components/appIds";
import DataSourceList from "../helpers/DataSourceList";
import {
  EvaIcsDataSourceInstanceSettings,
  GlobalSettings
} from "../datasource/types";
import { AppRootProps } from "@grafana/data";
import { config, getBackendSrv, PluginPage } from "@grafana/runtime";
import { DataSourceType } from "../constants";
import { Alert } from "@grafana/ui";

interface RootStateProps extends AppRootProps<GlobalSettings> {}

export const PageDS: React.FC<RootStateProps> = ({
  path,
  onNavChanged,
  meta
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<
    EvaIcsDataSourceInstanceSettings[]
  >([]);

  const fetchData = async () => {
    const result: EvaIcsDataSourceInstanceSettings[] =
      await getBackendSrv().get("/api/datasources");
    const filteredDataSources = result.filter(
      (ds: EvaIcsDataSourceInstanceSettings) => {
        return ds.type === DataSourceType.EVAICS;
      }
    );
    setDataSources(filteredDataSources);

    const settings: any = await getBackendSrv().get("/api/frontend/settings");
    if (settings.datasources) {
      config.datasources = settings.datasources;
      config.defaultDatasource = settings.defaultDatasource;
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Alert title="Loading..." severity="info">
        <p>Loading time depends on the number of configured data sources.</p>
      </Alert>
    );
  }

  return (
    <PluginPage>
      <div data-testid={appIds.pageDS.container}>
        <p>Configured EVA ICS datasources</p>
      </div>
      <DataSourceList dataSources={dataSources} />
    </PluginPage>
  );
};
