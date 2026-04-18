import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function ForecastChart({ baseRisk }: { baseRisk: number }) {
  const v = Number.isFinite(baseRisk) ? baseRisk : 0;

  const data = Array.from({ length: 7 }, (_, i) =>
    Math.max(0, Math.min(100, v + i * 4 + Math.random() * 2))
  );

  return (
    <LineChart
      data={{
        labels: ["D1","D2","D3","D4","D5","D6","D7"],
        datasets: [{ data }]
      }}
      width={Dimensions.get("window").width - 20}
      height={220}
      chartConfig={{
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: () => "#ff9900"
      }}
      bezier
    />
  );
}
