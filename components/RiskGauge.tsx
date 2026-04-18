import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function RiskGauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  const r = 60;
  const c = 2 * Math.PI * r;

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Svg width={160} height={160}>
        <Circle cx="80" cy="80" r={r} stroke="#eee" strokeWidth="12" />
        <Circle
          cx="80"
          cy="80"
          r={r}
          stroke="#00c2ff"
          strokeWidth="12"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          strokeLinecap="round"
        />
      </Svg>

      <Text style={{ fontSize: 26, fontWeight: "800", marginTop: -110 }}>
        {v.toFixed(0)}%
      </Text>
    </View>
  );
}