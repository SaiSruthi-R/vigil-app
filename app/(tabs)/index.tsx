import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";

import { Accelerometer } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";

const SAMPLE_SIZE = 500;

export default function Home() {
  // ---------------- INPUTS ----------------
  const [work, setWork] = useState("6");
  const [sleep, setSleep] = useState("6");
  const [meetings, setMeetings] = useState("3");
  const [caffeine, setCaffeine] = useState("2");
  const [screen, setScreen] = useState("5");

  // ---------------- OUTPUTS ----------------
  const [risk, setRisk] = useState(0);
  const [tremor, setTremor] = useState(0);

  const [history, setHistory] = useState<number[]>([10]);

  const [explanation, setExplanation] = useState<string[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [breakdown, setBreakdown] = useState<any>(null);

  const [status, setStatus] = useState("Idle");

  // ---------------- SENSOR ----------------
  const buffer = useRef<number[]>([]);
  const scanning = useRef(false);
  const subRef = useRef<any>(null);

  // ---------------- PULSE ----------------
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ---------------- TREMOR SCAN ----------------
  const startScan = () => {
    setStatus("Scanning tremor...");
    buffer.current = [];
    scanning.current = true;

    Accelerometer.setUpdateInterval(30);

    subRef.current = Accelerometer.addListener((data) => {
      if (!scanning.current) return;

      const mag = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

      buffer.current.push(mag);

      if (buffer.current.length >= SAMPLE_SIZE) {
        stopScan();
      }
    });
  };

  const stopScan = () => {
    scanning.current = false;
    if (subRef.current) subRef.current.remove();

    const t = computeTremor(buffer.current);
    setTremor(t);

    setStatus("Scan Complete");
  };

  // ---------------- TREMOR ENGINE ----------------
  const computeTremor = (data: number[]) => {
    if (!data?.length) return 0;

    const clean = data.filter((v) => Number.isFinite(v));
    if (!clean.length) return 0;

    const mean =
      clean.reduce((a, b) => a + b, 0) / clean.length;

    let total = 0;
    let band = 0;

    for (let i = 0; i < clean.length; i++) {
      const v = clean[i] - mean;
      const energy = v * v;

      total += energy;

      const freq = (i * 50) / SAMPLE_SIZE;
      if (freq >= 8 && freq <= 12) band += energy;
    }

    const score = total > 0 ? (band / total) * 100 : 0;

    return Math.max(0, Math.min(100, score));
  };

  const w = Number(work) || 0;
const s = Number(sleep) || 0;
const m = Number(meetings) || 0;
const c = Number(caffeine) || 0;
const sc = Number(screen) || 0;
const t = Number(tremor) || 0;

// ---------------- BLACKBOX RISK ----------------
const workScore = (w /8)* 100;
const sleepScore = -s * 3;
const meetingScore = m * 3;
const caffeineScore = c * 2;
const screenScore = sc * 1.2;
const tremorScore = t * 2.5;

let r =
  workScore +
  sleepScore +
  meetingScore +
  caffeineScore +
  screenScore +
  tremorScore;

r = Math.max(0, Math.min(100, r));

setRisk(r);

// ---------------- HISTORY ----------------
setHistory((prev) => {
  const updated = [...prev, r].filter((v) => Number.isFinite(v));
  return updated.slice(-25);
});

const runAnalysis = () => {
  const w = Number(work) || 0;
  const s = Number(sleep) || 0;
  const m = Number(meetings) || 0;
  const c = Number(caffeine) || 0;
  const sc = Number(screen) || 0;
  const t = Number(tremor) || 0;

  // ---------------- BLACKBOX ----------------
  const workScore = w * 2;
  const sleepScore = -s * 3;
  const meetingScore = m * 3;
  const caffeineScore = c * 2;
  const screenScore = sc * 1.2;
  const tremorScore = t * 2.5;

  let r =
    workScore +
    sleepScore +
    meetingScore +
    caffeineScore +
    screenScore +
    tremorScore;

  r = Math.max(0, Math.min(100, r));

  setRisk(r);

  // ---------------- HISTORY ----------------
  setHistory((prev) => {
    const updated = [...prev, r];
    return updated.slice(-25);
  });

  // ---------------- EXPLANATION ----------------
  const explanation: string[] = [];

  if (r > 75) explanation.push("Severe burnout risk detected");
  else if (r > 50) explanation.push("Moderate stress detected");
  else explanation.push("Stable condition");

  if (s < 5) explanation.push("Sleep deprivation is major factor");
  if (w > 8) explanation.push("High workload strain");
  if (m > 4) explanation.push("Meeting overload");
  if (c > 3) explanation.push("Caffeine masking fatigue");
  if (t > 40) explanation.push("Physiological tremor detected");

  setExplanation(explanation);

  // ---------------- ADVICE ----------------
  const advice: string[] = [];

const sleepDebt = Math.max(0, 8 - s);

advice.push(`Sleep debt: ${sleepDebt.toFixed(1)} hrs`);

if (r > 70) {
  advice.push("HIGH RISK: Immediate rest required");
  advice.push("Avoid caffeine completely");
  advice.push("Stop heavy cognitive work today");
} else if (r > 40) {
  advice.push("MODERATE RISK: Reduce workload");
  advice.push("Take breaks every 45–60 mins");
} else {
  advice.push("LOW RISK: Maintain routine");
}

if (w > 8) advice.push("Work overload detected");
if (m > 4) advice.push("Meeting fatigue present");
if (c > 3) advice.push("Caffeine dependency rising");
if (t > 40) advice.push("Physiological stress detected");

setAdvice([...advice]);

  // ---------------- BREAKDOWN ----------------
  setBreakdown({
    workScore,
    sleepScore,
    meetingScore,
    caffeineScore,
    screenScore,
    tremorScore,
    finalRisk: r,
    sleepDebt,
  });
};
  };

  // ---------------- UI ----------------
  return (
    <LinearGradient colors={["#fff7d6", "#d7f3ff"]} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* TITLE */}
        <Text style={styles.title}>VIGIL</Text>
        <Text style={styles.sub}>Burnout Intelligence System</Text>

        {/* INPUTS */}
        <View style={styles.card}>
          <Text style={styles.section}>Inputs</Text>

          <Text>Work</Text>
          <TextInput style={styles.input} value={work} onChangeText={setWork} />

          <Text>Sleep</Text>
          <TextInput style={styles.input} value={sleep} onChangeText={setSleep} />

          <Text>Meetings</Text>
          <TextInput style={styles.input} value={meetings} onChangeText={setMeetings} />

          <Text>Caffeine</Text>
          <TextInput style={styles.input} value={caffeine} onChangeText={setCaffeine} />

          <Text>Screen</Text>
          <TextInput style={styles.input} value={screen} onChangeText={setScreen} />
        </View>

        {/* BUTTONS */}
        <Pressable style={styles.button} onPress={startScan}>
          <Text style={styles.btnText}>Start Tremor Scan</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: "#333" }]} onPress={runAnalysis}>
          <Text style={styles.btnText}>Run Diagnostic</Text>
        </Pressable>

        {/* RISK ORB */}
        <Animated.View style={[styles.orb, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.orbText}>{risk.toFixed(0)}%</Text>
        </Animated.View>

        {/* STATUS */}
        <Text style={styles.status}>{status}</Text>

        {/* TREMOR */}
        <View style={styles.card}>
          <Text style={styles.section}>Tremor Signal</Text>

          <View style={styles.wave}>
            {buffer.current.slice(-40).map((v, i) => (
              <View
                key={i}
                style={{
                  width: 4,
                  height: Math.max(5, Math.min(80, v)),
                  marginHorizontal: 1,
                  backgroundColor: v > 50 ? "#ff3b30" : "#007aff",
                  borderRadius: 2,
                }}
              />
            ))}
          </View>
        </View>

        {/* EXPLANATION */}
        <View style={styles.card}>
  <Text style={styles.section}>AI Action Plan</Text>

  {advice.length === 0 ? (
    <Text>• Run diagnostic to generate insights</Text>
  ) : (
    advice.map((a, i) => (
      <Text key={i}>• {a}</Text>
    ))
  )}
</View>

        {/* ADVICE */}
        <View style={styles.card}>
          <Text style={styles.section}>AI Action Plan</Text>
          {advice.map((a, i) => (
            <Text key={i}>• {a}</Text>
          ))}
        </View>

        {/* BLACKBOX */}
        {breakdown && (
          <View style={styles.card}>
            <Text style={styles.section}>Blackbox Breakdown</Text>

            <Text>Work: {breakdown.workScore.toFixed(1)}</Text>
            <Text>Sleep: {breakdown.sleepScore.toFixed(1)}</Text>
            <Text>Meetings: {breakdown.meetingScore.toFixed(1)}</Text>
            <Text>Caffeine: {breakdown.caffeineScore.toFixed(1)}</Text>
            <Text>Screen: {breakdown.screenScore.toFixed(1)}</Text>
            <Text>Tremor: {breakdown.tremorScore.toFixed(1)}</Text>

            <Text style={{ fontWeight: "900", marginTop: 10 }}>
              Final Risk: {breakdown.finalRisk.toFixed(1)}%
            </Text>
          </View>
        )}

      </ScrollView>
    </LinearGradient>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: { paddingBottom: 50 },

  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 20,
  },

  sub: {
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },

  card: {
    margin: 12,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
  },

  section: {
    fontWeight: "800",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },

  button: {
    margin: 12,
    padding: 14,
    backgroundColor: "#000",
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  orb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#007aff",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  orbText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },

  status: {
    textAlign: "center",
    marginBottom: 10,
  },

  wave: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
  },
});