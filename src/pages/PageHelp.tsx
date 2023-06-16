import React from "react";
import { appIds } from "../components/appIds";
import { PluginPage } from "@grafana/runtime";

export function PageHelp() {
  return (
    <PluginPage>
      <div data-testid={appIds.pageHelp.container} style={{ height: "100%" }}>
        See{" "}
        <a href="https://info.bma.ai/en/actual/evaics-app-grafana/index.html">
          https://info.bma.ai/en/actual/evaics-app-grafana/index.html
        </a>
      </div>
    </PluginPage>
  );
}
