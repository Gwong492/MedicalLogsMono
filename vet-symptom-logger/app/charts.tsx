import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, Activity, Heart } from 'lucide-react-native';
import { Card, CardContent } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import Svg, { Line, Circle, Text as SvgText, Rect, Path } from 'react-native-svg';
import {
  loadPainEntries,
  loadHeadacheEntries,
  loadBPEntries,
  type PainEntry,
  type HeadacheEntry,
  type BloodPressureEntry,
} from '@/lib/storage';

type DateRange = '7' | '30' | '90' | 'all';

type DataPoint = {
  date: Date;
  value: number;
  label?: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 200;

export default function ChartsScreen() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [painEntries, setPainEntries] = useState<PainEntry[]>([]);
  const [headacheEntries, setHeadacheEntries] = useState<HeadacheEntry[]>([]);
  const [bpEntries, setBPEntries] = useState<BloodPressureEntry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pain, headache, bp] = await Promise.all([
      loadPainEntries(),
      loadHeadacheEntries(),
      loadBPEntries(),
    ]);
    setPainEntries(pain);
    setHeadacheEntries(headache);
    setBPEntries(bp);
  };

  const filterByDateRange = (date: Date): boolean => {
    if (dateRange === 'all') return true;
    const days = parseInt(dateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return date >= cutoff;
  };

  // Pain data
  const painData = useMemo(() => {
    return painEntries
      .filter(e => filterByDateRange(new Date(e.dateTime)))
      .map(e => ({
        date: new Date(e.dateTime),
        value: e.painLevel,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [painEntries, dateRange]);

  // Headache data (intensity over time)
  const headacheIntensityData = useMemo(() => {
    return headacheEntries
      .filter(e => filterByDateRange(new Date(e.startDateTime)))
      .map(e => ({
        date: new Date(e.startDateTime),
        value: e.intensity,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [headacheEntries, dateRange]);

  // Headache frequency (count per week)
  const headacheFrequencyData = useMemo(() => {
    const filtered = headacheEntries.filter(e => filterByDateRange(new Date(e.startDateTime)));
    const weeklyCount: { [key: string]: number } = {};

    filtered.forEach(e => {
      const date = new Date(e.startDateTime);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().split('T')[0];
      weeklyCount[key] = (weeklyCount[key] || 0) + 1;
    });

    return Object.entries(weeklyCount)
      .map(([key, value]) => ({
        date: new Date(key),
        value,
        label: `Week of ${new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [headacheEntries, dateRange]);

  // BP data (systolic and diastolic)
  const bpSystolicData = useMemo(() => {
    return bpEntries
      .filter(e => filterByDateRange(new Date(e.dateTime)))
      .map(e => ({
        date: new Date(e.dateTime),
        value: e.systolic,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [bpEntries, dateRange]);

  const bpDiastolicData = useMemo(() => {
    return bpEntries
      .filter(e => filterByDateRange(new Date(e.dateTime)))
      .map(e => ({
        date: new Date(e.dateTime),
        value: e.diastolic,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [bpEntries, dateRange]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Charts & Trends</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, gap: 20 }}>
        {/* Date Range Selector */}
        <View className="mt-6">
          <Text className="text-sm font-medium text-muted-foreground mb-3">Date Range</Text>
          <View className="flex-row gap-2">
            {(['7', '30', '90', 'all'] as DateRange[]).map(range => (
              <TouchableOpacity
                key={range}
                onPress={() => setDateRange(range)}
                className={`flex-1 py-3 rounded-lg border ${
                  dateRange === range
                    ? 'bg-primary border-primary'
                    : 'bg-card border-border'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    dateRange === range ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {range === 'all' ? 'All' : `${range}d`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pain Level Trend */}
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center gap-2 mb-4">
              <Activity className="text-rose-500" size={20} />
              <Text className="text-lg font-bold text-foreground">Pain Level Over Time</Text>
            </View>
            {painData.length > 0 ? (
              <LineChart data={painData} maxValue={10} color="#fb7185" yLabel="Pain Level" />
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted-foreground">No pain entries in this range</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Headache Intensity Trend */}
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center gap-2 mb-4">
              <TrendingUp className="text-purple-500" size={20} />
              <Text className="text-lg font-bold text-foreground">Headache Intensity Over Time</Text>
            </View>
            {headacheIntensityData.length > 0 ? (
              <LineChart data={headacheIntensityData} maxValue={10} color="#a855f7" yLabel="Intensity" />
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted-foreground">No headache entries in this range</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Headache Frequency (Bar Chart) */}
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center gap-2 mb-4">
              <TrendingUp className="text-purple-500" size={20} />
              <Text className="text-lg font-bold text-foreground">Headache Frequency (Weekly)</Text>
            </View>
            {headacheFrequencyData.length > 0 ? (
              <BarChart data={headacheFrequencyData} color="#a855f7" yLabel="Count" />
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted-foreground">No headache entries in this range</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Blood Pressure Trends (Dual Line) */}
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center gap-2 mb-4">
              <Heart className="text-blue-500" size={20} />
              <Text className="text-lg font-bold text-foreground">Blood Pressure Trends</Text>
            </View>
            {bpSystolicData.length > 0 ? (
              <>
                <View className="flex-row gap-4 mb-3">
                  <View className="flex-row items-center gap-2">
                    <View className="w-4 h-4 rounded-full bg-blue-500" />
                    <Text className="text-sm text-muted-foreground">Systolic</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="w-4 h-4 rounded-full bg-cyan-500" />
                    <Text className="text-sm text-muted-foreground">Diastolic</Text>
                  </View>
                </View>
                <DualLineChart
                  data1={bpSystolicData}
                  data2={bpDiastolicData}
                  maxValue={200}
                  color1="#3b82f6"
                  color2="#06b6d4"
                  yLabel="mmHg"
                />
              </>
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted-foreground">No BP entries in this range</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-lg font-bold text-foreground mb-4">Summary Statistics</Text>
            <View className="gap-3">
              {painData.length > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Avg Pain Level:</Text>
                  <Text className="font-semibold text-foreground">
                    {(painData.reduce((sum, d) => sum + d.value, 0) / painData.length).toFixed(1)} / 10
                  </Text>
                </View>
              )}
              {headacheFrequencyData.length > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Total Headaches:</Text>
                  <Text className="font-semibold text-foreground">
                    {headacheFrequencyData.reduce((sum, d) => sum + d.value, 0)}
                  </Text>
                </View>
              )}
              {bpSystolicData.length > 0 && (
                <>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Avg Systolic:</Text>
                    <Text className="font-semibold text-foreground">
                      {(bpSystolicData.reduce((sum, d) => sum + d.value, 0) / bpSystolicData.length).toFixed(0)} mmHg
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">Avg Diastolic:</Text>
                    <Text className="font-semibold text-foreground">
                      {(bpDiastolicData.reduce((sum, d) => sum + d.value, 0) / bpDiastolicData.length).toFixed(0)} mmHg
                    </Text>
                  </View>
                </>
              )}
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// Line Chart Component
function LineChart({
  data,
  maxValue,
  color,
  yLabel,
}: {
  data: DataPoint[];
  maxValue: number;
  color: string;
  yLabel: string;
}) {
  if (data.length === 0) return null;

  const padding = 40;
  const chartWidth = CHART_WIDTH - padding * 2;
  const chartHeight = CHART_HEIGHT - padding * 2;

  const xStep = data.length > 1 ? chartWidth / (data.length - 1) : 0;
  const yScale = chartHeight / maxValue;

  const points = data.map((d, i) => ({
    x: padding + i * xStep,
    y: padding + chartHeight - d.value * yScale,
  }));

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Y-axis labels */}
      {[0, maxValue / 2, maxValue].map((val, i) => (
        <SvgText
          key={i}
          x={5}
          y={padding + chartHeight - (val / maxValue) * chartHeight + 5}
          fontSize="10"
          fill="#9ca3af"
        >
          {val}
        </SvgText>
      ))}

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <Line
          key={i}
          x1={padding}
          y1={padding + chartHeight * (1 - ratio)}
          x2={padding + chartWidth}
          y2={padding + chartHeight * (1 - ratio)}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4"
        />
      ))}

      {/* Line path */}
      <Path d={pathData} stroke={color} strokeWidth="2" fill="none" />

      {/* Data points */}
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
      ))}

      {/* X-axis labels (show first, middle, last) */}
      {data.length > 0 && (
        <>
          <SvgText
            x={padding}
            y={CHART_HEIGHT - 10}
            fontSize="10"
            fill="#9ca3af"
            textAnchor="start"
          >
            {data[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </SvgText>
          {data.length > 2 && (
            <SvgText
              x={padding + chartWidth}
              y={CHART_HEIGHT - 10}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="end"
            >
              {data[data.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </SvgText>
          )}
        </>
      )}
    </Svg>
  );
}

// Bar Chart Component
function BarChart({
  data,
  color,
  yLabel,
}: {
  data: DataPoint[];
  color: string;
  yLabel: string;
}) {
  if (data.length === 0) return null;

  const padding = 40;
  const chartWidth = CHART_WIDTH - padding * 2;
  const chartHeight = CHART_HEIGHT - padding * 2;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = Math.min(40, chartWidth / data.length - 10);
  const barSpacing = chartWidth / data.length;
  const yScale = chartHeight / (maxValue + 1);

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Y-axis labels */}
      {Array.from({ length: maxValue + 2 }, (_, i) => i).map(val => (
        <SvgText
          key={val}
          x={5}
          y={padding + chartHeight - val * yScale + 5}
          fontSize="10"
          fill="#9ca3af"
        >
          {val}
        </SvgText>
      ))}

      {/* Grid lines */}
      {Array.from({ length: maxValue + 2 }, (_, i) => i).map(val => (
        <Line
          key={val}
          x1={padding}
          y1={padding + chartHeight - val * yScale}
          x2={padding + chartWidth}
          y2={padding + chartHeight - val * yScale}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4"
        />
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = d.value * yScale;
        const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
        const y = padding + chartHeight - barHeight;
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={color}
            rx="4"
          />
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <SvgText
          key={i}
          x={padding + i * barSpacing + barSpacing / 2}
          y={CHART_HEIGHT - 10}
          fontSize="9"
          fill="#9ca3af"
          textAnchor="middle"
        >
          {d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </SvgText>
      ))}
    </Svg>
  );
}

// Dual Line Chart Component (for BP)
function DualLineChart({
  data1,
  data2,
  maxValue,
  color1,
  color2,
  yLabel,
}: {
  data1: DataPoint[];
  data2: DataPoint[];
  maxValue: number;
  color1: string;
  color2: string;
  yLabel: string;
}) {
  if (data1.length === 0 || data2.length === 0) return null;

  const padding = 40;
  const chartWidth = CHART_WIDTH - padding * 2;
  const chartHeight = CHART_HEIGHT - padding * 2;

  const xStep = data1.length > 1 ? chartWidth / (data1.length - 1) : 0;
  const yScale = chartHeight / maxValue;

  const points1 = data1.map((d, i) => ({
    x: padding + i * xStep,
    y: padding + chartHeight - d.value * yScale,
  }));

  const points2 = data2.map((d, i) => ({
    x: padding + i * xStep,
    y: padding + chartHeight - d.value * yScale,
  }));

  const pathData1 = points1.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const pathData2 = points2.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Y-axis labels */}
      {[0, maxValue / 2, maxValue].map((val, i) => (
        <SvgText
          key={i}
          x={5}
          y={padding + chartHeight - (val / maxValue) * chartHeight + 5}
          fontSize="10"
          fill="#9ca3af"
        >
          {val}
        </SvgText>
      ))}

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <Line
          key={i}
          x1={padding}
          y1={padding + chartHeight * (1 - ratio)}
          x2={padding + chartWidth}
          y2={padding + chartHeight * (1 - ratio)}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4"
        />
      ))}

      {/* Line paths */}
      <Path d={pathData1} stroke={color1} strokeWidth="2" fill="none" />
      <Path d={pathData2} stroke={color2} strokeWidth="2" fill="none" />

      {/* Data points */}
      {points1.map((p, i) => (
        <Circle key={`1-${i}`} cx={p.x} cy={p.y} r="4" fill={color1} />
      ))}
      {points2.map((p, i) => (
        <Circle key={`2-${i}`} cx={p.x} cy={p.y} r="4" fill={color2} />
      ))}

      {/* X-axis labels */}
      {data1.length > 0 && (
        <>
          <SvgText
            x={padding}
            y={CHART_HEIGHT - 10}
            fontSize="10"
            fill="#9ca3af"
            textAnchor="start"
          >
            {data1[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </SvgText>
          {data1.length > 2 && (
            <SvgText
              x={padding + chartWidth}
              y={CHART_HEIGHT - 10}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="end"
            >
              {data1[data1.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </SvgText>
          )}
        </>
      )}
    </Svg>
  );
}