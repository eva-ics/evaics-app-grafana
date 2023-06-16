import React, { useCallback } from "react";
import { EvaIcsDataSourceInstanceSettings } from "../datasource/types";
import { DataSourceType, DataSourceName, DashboardUri } from "../constants";
import {
  Container,
  HorizontalGroup,
  LinkButton,
  useStyles2,
  VerticalGroup
} from "@grafana/ui";
import { GrafanaTheme2 } from "@grafana/data";
import { css } from "@emotion/css";
import {
  getBackendSrv,
  locationService,
  getDataSourceSrv
} from "@grafana/runtime";
import EmptyState from "./EmptyState";
import EvaIcon from "../img/logo_small.svg";

const getNewDataSourceName = (
  dataSources: EvaIcsDataSourceInstanceSettings[]
) => {
  let postfix = 1;
  const name = DataSourceName.EVAICS;

  if (!dataSources.some((dataSource) => dataSource.name === name)) {
    return name;
  }

  while (
    dataSources.some((dataSource) => dataSource.name === `${name}-${postfix}`)
  ) {
    postfix++;
  }

  return `${name}-${postfix}`;
};

interface DataSourceListProps {
  dataSources: EvaIcsDataSourceInstanceSettings[];
}

const DataSourceList: React.FC<DataSourceListProps> = ({ dataSources }) => {
  const s = useStyles2(getStyles);

  const addNewDataSource = useCallback(() => {
    const be = getBackendSrv();
    be.post("/api/datasources", {
      name: getNewDataSourceName(dataSources),
      type: DataSourceType.EVAICS,
      access: "proxy"
    }).then(({ datasource }) => {
      getDataSourceSrv().reload();
      locationService.push(`/datasources/edit/${datasource.uid}`);
    });
  }, [dataSources]);

  if (!dataSources || !Array.isArray(dataSources)) {
    return null; // or return a loading state or handle the error condition
  }

  return (
    <>
      <div className={s.buttonWrapper}>
        <LinkButton variant="secondary" icon="plus" onClick={addNewDataSource}>
          Add EVA ICS datasource
        </LinkButton>
      </div>
      {!dataSources.length && <EmptyState />}
      <ul className={s.datasource_list}>
        {dataSources.map((eva, index) => {
          return (
            <li
              className="card-item-wrapper"
              key={index}
              aria-label="check-card"
            >
              <a
                className="card-item"
                href={`${DashboardUri.Overview}?var-eva=${eva.name}`}
              >
                <HorizontalGroup justify="space-between">
                  <HorizontalGroup justify="flex-start">
                    <Container margin="xs">
                      {/*<RedisCube size={32} fill={fill} title={title} />*/}
                    </Container>
                    <VerticalGroup>
                      <div className={s.card_preview}>
                        <img src={EvaIcon} alt="logo" className={s.logo} />
                        <div className={s.ds_name}>{eva.name}</div>
                        <div>
                          {(eva as any).jsonData.url
                            ? (eva as any).jsonData.url
                            : "Not specified"}
                        </div>
                      </div>
                    </VerticalGroup>
                  </HorizontalGroup>
                  <HorizontalGroup justify="flex-end">
                    {eva.commands?.length && (
                      <Container>
                        <LinkButton
                          href={`${DashboardUri.Overview}?var-eva=${eva.name}`}
                          title="EVA ICS Overview"
                          icon="monitor"
                        >
                          Overview
                        </LinkButton>
                      </Container>
                    )}
                    <Container>
                      <LinkButton
                        variant="secondary"
                        href={`/datasources/edit/${eva.uid}`}
                        title="Data Source Settings"
                        icon="sliders-v-alt"
                      >
                        Settings
                      </LinkButton>
                    </Container>
                  </HorizontalGroup>
                </HorizontalGroup>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  buttonWrapper: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  datasource_list: css`
    list-style: none;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  card_preview: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  `,
  logo: css`
    width: 20px;
    height: 20px;
    margin-right: 10px;
  `,
  ds_name: css`
    width: 100px;
  `
});

export default DataSourceList;
