import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, Settings } from "lucide-react-native";
import { loadProfile, saveProfile, type Profile } from "@/lib/storage";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent } from "@/components/Card";
import { PickerField } from "@/components/PickerField";
import { cssInterop } from "nativewind";

// All IANA time zones
const TIME_ZONES = [
  { label: "Pacific/Midway (UTC-11:00)", value: "Pacific/Midway" },
  { label: "Pacific/Honolulu (UTC-10:00)", value: "Pacific/Honolulu" },
  { label: "America/Anchorage (UTC-09:00)", value: "America/Anchorage" },
  { label: "America/Los_Angeles (UTC-08:00)", value: "America/Los_Angeles" },
  { label: "America/Tijuana (UTC-08:00)", value: "America/Tijuana" },
  { label: "America/Denver (UTC-07:00)", value: "America/Denver" },
  { label: "America/Phoenix (UTC-07:00)", value: "America/Phoenix" },
  { label: "America/Chihuahua (UTC-07:00)", value: "America/Chihuahua" },
  { label: "America/Chicago (UTC-06:00)", value: "America/Chicago" },
  { label: "America/Mexico_City (UTC-06:00)", value: "America/Mexico_City" },
  { label: "America/Regina (UTC-06:00)", value: "America/Regina" },
  { label: "America/New_York (UTC-05:00)", value: "America/New_York" },
  { label: "America/Bogota (UTC-05:00)", value: "America/Bogota" },
  { label: "America/Lima (UTC-05:00)", value: "America/Lima" },
  { label: "America/Caracas (UTC-04:00)", value: "America/Caracas" },
  { label: "America/Halifax (UTC-04:00)", value: "America/Halifax" },
  { label: "America/Santiago (UTC-04:00)", value: "America/Santiago" },
  { label: "America/St_Johns (UTC-03:30)", value: "America/St_Johns" },
  { label: "America/Sao_Paulo (UTC-03:00)", value: "America/Sao_Paulo" },
  {
    label: "America/Argentina/Buenos_Aires (UTC-03:00)",
    value: "America/Argentina/Buenos_Aires",
  },
  { label: "America/Godthab (UTC-03:00)", value: "America/Godthab" },
  {
    label: "Atlantic/South_Georgia (UTC-02:00)",
    value: "Atlantic/South_Georgia",
  },
  { label: "Atlantic/Azores (UTC-01:00)", value: "Atlantic/Azores" },
  { label: "Atlantic/Cape_Verde (UTC-01:00)", value: "Atlantic/Cape_Verde" },
  { label: "Europe/London (UTC+00:00)", value: "Europe/London" },
  { label: "Europe/Dublin (UTC+00:00)", value: "Europe/Dublin" },
  { label: "Africa/Casablanca (UTC+00:00)", value: "Africa/Casablanca" },
  { label: "Europe/Paris (UTC+01:00)", value: "Europe/Paris" },
  { label: "Europe/Berlin (UTC+01:00)", value: "Europe/Berlin" },
  { label: "Europe/Rome (UTC+01:00)", value: "Europe/Rome" },
  { label: "Europe/Madrid (UTC+01:00)", value: "Europe/Madrid" },
  { label: "Africa/Lagos (UTC+01:00)", value: "Africa/Lagos" },
  { label: "Europe/Athens (UTC+02:00)", value: "Europe/Athens" },
  { label: "Europe/Istanbul (UTC+02:00)", value: "Europe/Istanbul" },
  { label: "Africa/Cairo (UTC+02:00)", value: "Africa/Cairo" },
  { label: "Africa/Johannesburg (UTC+02:00)", value: "Africa/Johannesburg" },
  { label: "Europe/Helsinki (UTC+02:00)", value: "Europe/Helsinki" },
  { label: "Asia/Jerusalem (UTC+02:00)", value: "Asia/Jerusalem" },
  { label: "Europe/Moscow (UTC+03:00)", value: "Europe/Moscow" },
  { label: "Asia/Baghdad (UTC+03:00)", value: "Asia/Baghdad" },
  { label: "Asia/Kuwait (UTC+03:00)", value: "Asia/Kuwait" },
  { label: "Africa/Nairobi (UTC+03:00)", value: "Africa/Nairobi" },
  { label: "Asia/Tehran (UTC+03:30)", value: "Asia/Tehran" },
  { label: "Asia/Dubai (UTC+04:00)", value: "Asia/Dubai" },
  { label: "Asia/Baku (UTC+04:00)", value: "Asia/Baku" },
  { label: "Asia/Kabul (UTC+04:30)", value: "Asia/Kabul" },
  { label: "Asia/Karachi (UTC+05:00)", value: "Asia/Karachi" },
  { label: "Asia/Tashkent (UTC+05:00)", value: "Asia/Tashkent" },
  { label: "Asia/Kolkata (UTC+05:30)", value: "Asia/Kolkata" },
  { label: "Asia/Colombo (UTC+05:30)", value: "Asia/Colombo" },
  { label: "Asia/Kathmandu (UTC+05:45)", value: "Asia/Kathmandu" },
  { label: "Asia/Dhaka (UTC+06:00)", value: "Asia/Dhaka" },
  { label: "Asia/Almaty (UTC+06:00)", value: "Asia/Almaty" },
  { label: "Asia/Yangon (UTC+06:30)", value: "Asia/Yangon" },
  { label: "Asia/Bangkok (UTC+07:00)", value: "Asia/Bangkok" },
  { label: "Asia/Jakarta (UTC+07:00)", value: "Asia/Jakarta" },
  { label: "Asia/Shanghai (UTC+08:00)", value: "Asia/Shanghai" },
  { label: "Asia/Hong_Kong (UTC+08:00)", value: "Asia/Hong_Kong" },
  { label: "Asia/Singapore (UTC+08:00)", value: "Asia/Singapore" },
  { label: "Australia/Perth (UTC+08:00)", value: "Australia/Perth" },
  { label: "Asia/Taipei (UTC+08:00)", value: "Asia/Taipei" },
  { label: "Asia/Tokyo (UTC+09:00)", value: "Asia/Tokyo" },
  { label: "Asia/Seoul (UTC+09:00)", value: "Asia/Seoul" },
  { label: "Australia/Adelaide (UTC+09:30)", value: "Australia/Adelaide" },
  { label: "Australia/Darwin (UTC+09:30)", value: "Australia/Darwin" },
  { label: "Australia/Sydney (UTC+10:00)", value: "Australia/Sydney" },
  { label: "Australia/Brisbane (UTC+10:00)", value: "Australia/Brisbane" },
  { label: "Pacific/Guam (UTC+10:00)", value: "Pacific/Guam" },
  { label: "Pacific/Noumea (UTC+11:00)", value: "Pacific/Noumea" },
  { label: "Pacific/Auckland (UTC+12:00)", value: "Pacific/Auckland" },
  { label: "Pacific/Fiji (UTC+12:00)", value: "Pacific/Fiji" },
  { label: "Pacific/Tongatapu (UTC+13:00)", value: "Pacific/Tongatapu" },
];

cssInterop(User, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
cssInterop(Settings, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export default function ProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const profile = await loadProfile();
    if (profile) {
      setFullName(profile.fullName);
      setTimeZone(profile.timeZone);
      setNotes(profile.notes || "");
    } else {
      // Set device timezone as default
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(tz);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }

    const profile: Profile = {
      fullName: fullName.trim(),
      timeZone:
        timeZone.trim() || Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: notes.trim(),
    };

    await saveProfile(profile);
    Alert.alert("Success", "Profile saved successfully.", [
      { text: "OK", onPress: () => router.replace("/dashboard") },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
        <View className="items-center mb-8 mt-4">
          <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
            <User className="text-primary" size={32} />
          </View>
          <Text className="text-2xl font-bold text-foreground">
            Your Profile
          </Text>
          <Text className="text-muted-foreground text-center mt-1">
            Set up your profile information
          </Text>
        </View>

        <Card className="mb-6">
          <CardContent className="py-6 gap-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Full Name <Text className="text-destructive">*</Text>
              </Text>
              <Input
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            <PickerField
              label="Time Zone"
              value={timeZone}
              onValueChange={setTimeZone}
              items={TIME_ZONES}
            />

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </Text>
              <Input
                placeholder="Any additional notes..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: "top" }}
              />
            </View>
          </CardContent>
        </Card>

        <Button onPress={handleSave} fullWidth>
          Save Profile
        </Button>

        {/* Developer Settings */}
        <Card className="mt-6 border-muted">
          <CardContent className="py-4">
            <TouchableOpacity
              onPress={() => router.push("/dev-settings")}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Settings className="text-muted-foreground" size={20} />
                <View>
                  <Text className="text-base font-medium text-foreground">
                    Developer Settings
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Testing tools and seed data
                  </Text>
                </View>
              </View>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
