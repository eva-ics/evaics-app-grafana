import React from "react";
import { PanelProps } from "@grafana/data";
import { EvaEHMIOptions } from "../types";
import { useTheme2 } from "@grafana/ui";

interface Props extends PanelProps<EvaEHMIOptions> {}

export const EvaEHMIPanel: React.FC<Props> = ({
  options,
  data,
  width,
  height
}) => {
  const theme = useTheme2();
  const bg = theme.colors.background.primary;
  const fg = theme.colors.text.primary;
  const params = new URLSearchParams({
    bg: bg,
    fg: fg
  }).toString();
  let ehmi_url;
  if (
    data.series &&
    data.series.length > 0 &&
    data.series[0].fields &&
    data.series[0].fields[0]
  ) {
    const field = data.series[0].fields[0];
    if (field.name === "ehmi_app_url") {
      ehmi_url = field.values.get(0);
    }
  }
  if (!ehmi_url) {
    throw new Error("ehmi application error");
  }
  return (
    <div>
      <iframe
        style={{ border: "0px" }}
        width={width}
        height={height}
        src={`${ehmi_url}&${params}`}
      ></iframe>
    </div>
  );
};
