import React from "react";
import { Alert, useStyles2 } from "@grafana/ui";
import { GrafanaTheme2 } from "@grafana/data";
import { css } from "@emotion/css";

const EmptyState = () => {
  const s = useStyles2(getStyles);

  return (
    <Alert
      title="No datasources configured"
      severity="info"
      className={s.emptyState}
    ></Alert>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  emptyState: css`
    margin-top: 20px;
    height: 100px;
  `,
});
export default EmptyState;
