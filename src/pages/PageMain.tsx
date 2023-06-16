import React from "react";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { LinkButton, useStyles2 } from "@grafana/ui";
import { prefixRoute } from "../utils/utils.routing";
import { ROUTES } from "../constants";
import { appIds } from "../components/appIds";
import { PluginPage } from "@grafana/runtime";

export function PageMain() {
  const s = useStyles2(getStyles);

  return (
    <PluginPage>
      <div data-testid={appIds.pageMain.container}>
        <img
          src="https://pub.bma.ai/i/face_transparent.png"
          style={{ float: "right" }}
          width="400"
        />
        <p>
          EVA ICS application for Grafana allows to connect EVA ICS v4 nodes
          directly to Grafana with no database access required.
        </p>
        <p>
          The application plugin also provides embedded HMI controls panel,
          which allows to place HMI control buttons directly on Grafana
          dashboards.
        </p>
        <h3>Typical queries</h3>
        <p>
          <div style={{ width: "500px" }}>
          Get an item state (or for multiple comma-separated items):
          <pre>s sensor:group/id</pre>
          </div>
          <div style={{ width: "500px" }}>
          Get 100 dots of historical data for an item value register:
          <pre>h sensor:group/id prop=value fill=100A</pre>
          </div>
          <div style={{ width: "500px" }}>
          Get failed API calls (requires admin API key):
          <pre>api_log.get t_start=$&#123;from&#125; t_end=$&#123;to&#125; success=false</pre>
          </div>
          <div style={{ width: "500px" }}>
          Get node replication status (requires admin API key):
          <pre>bus::eva.core::node.list</pre>
          </div>
          <div style={{ width: "500px" }}>
          Get active HMI sessions (requires admin API key):
          <pre>bus::eva.hmi.default::session.list</pre>
          </div>
        </p>
        <div className={s.marginTop}>
          <p>
            <LinkButton
              data-testid={appIds.pageMain.navigateToDS}
              href={prefixRoute(ROUTES.DS)}
            >
              Manage connections
            </LinkButton>
          </p>
          <p>
            <LinkButton
              data-testid={appIds.pageMain.navigateToHelp}
              href="https://info.bma.ai/en/actual/eva4/hmi/grafana/index.html"
            >
              Help at Bohemia Automation Informational System
            </LinkButton>
          </p>
        </div>
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `
});
