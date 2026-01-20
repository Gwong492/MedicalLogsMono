import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Activity,
  Heart,
  Zap,
  FileText,
  User,
  Clock,
  TrendingUp,
  Download,
  Calendar,
} from "lucide-react-native";
import { getTodayEntriesCount } from "@/lib/storage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";

export default function DashboardScreen() {
  const router = useRouter();
  const [todayCounts, setTodayCounts] = useState({
    pain: 0,
    headache: 0,
    bp: 0,
    cycle: 0,
  });

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    const counts = await getTodayEntriesCount();
    setTodayCounts(counts);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-4">
        <View>
          <Text className="text-muted-foreground">Welcome back</Text>
          <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <User className="text-foreground" size={24} />
          </TouchableOpacity>
          <ThemeToggle />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 128,
          gap: 16,
        }}
      >
        <Card>
          <CardContent className="py-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Today's Overview
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 items-center py-3 bg-muted rounded-lg">
                <Activity className="text-primary mb-1" size={20} />
                <Text className="font-bold text-lg text-foreground">
                  {todayCounts.pain}
                </Text>
                <Text className="text-xs text-muted-foreground">Pain</Text>
              </View>
              <View className="flex-1 items-center py-3 bg-muted rounded-lg">
                <Zap className="text-primary mb-1" size={20} />
                <Text className="font-bold text-lg text-foreground">
                  {todayCounts.headache}
                </Text>
                <Text className="text-xs text-muted-foreground">Headache</Text>
              </View>
              <View className="flex-1 items-center py-3 bg-muted rounded-lg">
                <Heart className="text-primary mb-1" size={20} />
                <Text className="font-bold text-lg text-foreground">
                  {todayCounts.bp}
                </Text>
                <Text className="text-xs text-muted-foreground">BP</Text>
              </View>
              <View className="flex-1 items-center py-3 bg-muted rounded-lg">
                <Calendar className="text-primary mb-1" size={20} />
                <Text className="font-bold text-lg text-foreground">
                  {todayCounts.cycle}
                </Text>
                <Text className="text-xs text-muted-foreground">Cycle</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <View>
          <Text className="text-lg font-semibold text-foreground mb-3">
            Quick Actions
          </Text>
          <View className="gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/pain-entry")}
            >
              <Card>
                <CardContent className="py-4 flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Activity className="text-primary" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      Log Pain
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Track pain symptoms
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/headache-entry")}
            >
              <Card>
                <CardContent className="py-4 flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Zap className="text-primary" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      Log Headache
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Record headache details
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/bp-entry")}
            >
              <Card>
                <CardContent className="py-4 flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Heart className="text-primary" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      Log Blood Pressure
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Record BP reading
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/cycle-entry")}
            >
              <Card>
                <CardContent className="py-4 flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Calendar className="text-primary" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      Log Cycle
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Track menstrual cycle
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-3 mb-3">
              <Clock className="text-primary" size={24} />
              <Text className="text-lg font-semibold text-foreground flex-1">
                Timeline
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              View all your symptom logs with filtering and search.
            </Text>
            <Button
              variant="secondary"
              fullWidth
              onPress={() => router.push("/timeline")}
            >
              View Timeline
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-3 mb-3">
              <TrendingUp className="text-primary" size={24} />
              <Text className="text-lg font-semibold text-foreground flex-1">
                Charts & Trends
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              Visualize your symptom patterns over time with interactive charts.
            </Text>
            <Button
              variant="secondary"
              fullWidth
              onPress={() => router.push("/charts")}
            >
              View Charts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <View className="flex-row items-center gap-3 mb-3">
              <Download className="text-primary" size={24} />
              <Text className="text-lg font-semibold text-foreground flex-1">
                Exports
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              Generate summaries and export your symptom data for healthcare
              providers.
            </Text>
            <Button
              variant="secondary"
              fullWidth
              onPress={() => router.push("/exports")}
            >
              View Export Options
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
