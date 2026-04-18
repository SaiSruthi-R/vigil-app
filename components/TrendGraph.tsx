import React from "react";
import { Dimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const WIDTH = Dimensions.get("window").width;

export default function TrendGraph({ data }: { data: number[] }) {
  const safeData =
    Array.isArray(data) && data.length > 0 ? data : [10];

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "700", marginLeft: 10 }}>
        Burnout Trend
      </Text>

      <LineChart
        data={{
          labels: safeData.map((_, i) => `${i + 1}`),
          datasets: [
            {
              data: safeData.map((v) =>
                Number.isFinite(v) ? v : 0
              ),
            },
          ],
        }}
        width={WIDTH - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#000000",
          decimalPlaces: 0,
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
      />
    </View>
  );
}