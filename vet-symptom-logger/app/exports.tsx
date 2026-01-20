import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { ArrowLeft, FileText, Code, Check } from 'lucide-react-native';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loadAllEntries, loadProfile, type Entry, type Profile } from '@/lib/storage';

type DateRange = '7' | '30' | '90' | 'all';

export default function ExportsScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [copiedFormat, setCopiedFormat] = useState<'text' | 'json' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allEntries, profileData] = await Promise.all([
        loadAllEntries(),
        loadProfile(),
      ]);
      setEntries(allEntries);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    if (dateRange === 'all') return entries;

    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.type === 'headache' ? entry.startDateTime : entry.dateTime);
      return entryDate >= cutoffDate;
    });
  }, [entries, dateRange]);

  const generateVAFriendlyText = (): string => {
    const lines: string[] = [];
    
    // Header
    lines.push('VETERAN SYMPTOM LOG SUMMARY');
    lines.push('Generated: ' + new Date().toLocaleString());
    lines.push('');
    
    // Profile
    if (profile) {
      lines.push('VETERAN INFORMATION');
      lines.push('Name: ' + profile.fullName);
      lines.push('Time Zone: ' + profile.timeZone);
      if (profile.notes) {
        lines.push('Notes: ' + profile.notes);
      }
      lines.push('');
    }

    // Date range
    lines.push('REPORTING PERIOD');
    if (dateRange === 'all') {
      lines.push('All recorded entries');
    } else {
      lines.push(`Last ${dateRange} days`);
    }
    lines.push(`Total Entries: ${filteredEntries.length}`);
    lines.push('');

    // Summary statistics
    const painEntries = filteredEntries.filter(e => e.type === 'pain');
    const headacheEntries = filteredEntries.filter(e => e.type === 'headache');
    const bpEntries = filteredEntries.filter(e => e.type === 'bloodPressure');

    lines.push('SUMMARY STATISTICS');
    lines.push(`Pain Episodes: ${painEntries.length}`);
    lines.push(`Headache Episodes: ${headacheEntries.length}`);
    lines.push(`Blood Pressure Readings: ${bpEntries.length}`);
    lines.push('');

    if (painEntries.length > 0) {
      const avgPain = painEntries.reduce((sum, e) => sum + e.painLevel, 0) / painEntries.length;
      lines.push(`Average Pain Level: ${avgPain.toFixed(1)}/10`);
    }
    if (headacheEntries.length > 0) {
      const avgIntensity = headacheEntries.reduce((sum, e) => sum + e.intensity, 0) / headacheEntries.length;
      const missedWork = headacheEntries.filter(e => e.missedWork).length;
      lines.push(`Average Headache Intensity: ${avgIntensity.toFixed(1)}/10`);
      lines.push(`Episodes Causing Missed Work: ${missedWork}`);
    }
    if (bpEntries.length > 0) {
      const avgSystolic = bpEntries.reduce((sum, e) => sum + e.systolic, 0) / bpEntries.length;
      const avgDiastolic = bpEntries.reduce((sum, e) => sum + e.diastolic, 0) / bpEntries.length;
      const highReadings = bpEntries.filter(e => e.systolic >= 140 || e.diastolic >= 90).length;
      lines.push(`Average BP: ${avgSystolic.toFixed(0)}/${avgDiastolic.toFixed(0)} mmHg`);
      lines.push(`Elevated Readings (≥140/90): ${highReadings}`);
    }
    lines.push('');
    lines.push('═'.repeat(60));
    lines.push('');

    // Detailed entries
    lines.push('DETAILED ENTRIES (Newest First)');
    lines.push('');

    filteredEntries.forEach((entry, index) => {
      lines.push(`ENTRY ${index + 1}: ${entry.type.toUpperCase()}`);
      lines.push('─'.repeat(60));

      if (entry.type === 'pain') {
        lines.push(`Date/Time: ${new Date(entry.dateTime).toLocaleString()}`);
        lines.push(`Pain Level: ${entry.painLevel}/10`);
        lines.push(`Location: ${entry.location}`);
        lines.push(`Body Region: ${entry.bodyRegion}`);
        lines.push(`Pain Type: ${entry.painType}`);
        lines.push(`Duration: ${entry.duration} minutes`);
        if (entry.triggers) lines.push(`Triggers: ${entry.triggers}`);
        
        const impacts = [];
        if (entry.functionalImpact.sleep) impacts.push('Sleep');
        if (entry.functionalImpact.work) impacts.push('Work');
        if (entry.functionalImpact.walking) impacts.push('Walking');
        if (entry.functionalImpact.lifting) impacts.push('Lifting');
        if (impacts.length > 0) {
          lines.push(`Functional Impact: ${impacts.join(', ')}`);
        }

        if (entry.medications) {
          lines.push(`Medications: ${entry.medications}`);
          lines.push(`Relief Achieved: ${entry.reliefPercent}%`);
        }
        if (entry.notes) lines.push(`Notes: ${entry.notes}`);
      } else if (entry.type === 'headache') {
        lines.push(`Start: ${new Date(entry.startDateTime).toLocaleString()}`);
        if (entry.endDateTime) {
          lines.push(`End: ${new Date(entry.endDateTime).toLocaleString()}`);
          const duration = (new Date(entry.endDateTime).getTime() - new Date(entry.startDateTime).getTime()) / 60000;
          lines.push(`Duration: ${Math.round(duration)} minutes`);
        } else {
          lines.push(`Status: Ongoing`);
        }
        lines.push(`Intensity: ${entry.intensity}/10`);
        if (entry.symptoms.length > 0) {
          lines.push(`Symptoms: ${entry.symptoms.join(', ')}`);
        }
        if (entry.triggers) lines.push(`Triggers: ${entry.triggers}`);
        if (entry.requiredLyingDown) lines.push(`Required Lying Down: Yes`);
        if (entry.missedWork) lines.push(`Missed Work: Yes`);
        if (entry.medications) {
          lines.push(`Medications: ${entry.medications}`);
          lines.push(`Relief Achieved: ${entry.reliefPercent}%`);
        }
        if (entry.notes) lines.push(`Notes: ${entry.notes}`);
      } else if (entry.type === 'bloodPressure') {
        lines.push(`Date/Time: ${new Date(entry.dateTime).toLocaleString()}`);
        lines.push(`Blood Pressure: ${entry.systolic}/${entry.diastolic} mmHg`);
        if (entry.pulse) lines.push(`Pulse: ${entry.pulse} bpm`);
        lines.push(`Posture: ${entry.posture.charAt(0).toUpperCase() + entry.posture.slice(1)}`);
        lines.push(`Arm Used: ${entry.armUsed.charAt(0).toUpperCase() + entry.armUsed.slice(1)}`);
        lines.push(`Device: ${entry.deviceType}`);
        if (entry.systolic >= 140 || entry.diastolic >= 90) {
          lines.push(`⚠️ ELEVATED READING (≥140/90)`);
        }
        if (entry.notes) lines.push(`Notes: ${entry.notes}`);
      }

      lines.push('');
    });

    lines.push('═'.repeat(60));
    lines.push('END OF REPORT');
    lines.push('');
    lines.push('This report is intended for VA disability claim documentation.');
    lines.push('All dates/times are in the veteran\'s local time zone.');

    return lines.join('\n');
  };

  const generateJSON = (): string => {
    const exportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        dateRange: dateRange === 'all' ? 'all' : `last_${dateRange}_days`,
        totalEntries: filteredEntries.length,
        version: '1.0',
      },
      profile: profile || {},
      summary: {
        painEntries: filteredEntries.filter(e => e.type === 'pain').length,
        headacheEntries: filteredEntries.filter(e => e.type === 'headache').length,
        bloodPressureEntries: filteredEntries.filter(e => e.type === 'bloodPressure').length,
      },
      entries: filteredEntries,
    };

    return JSON.stringify(exportData, null, 2);
  };

  const copyToClipboard = async (format: 'text' | 'json') => {
    try {
      const content = format === 'text' ? generateVAFriendlyText() : generateJSON();
      await Clipboard.setStringAsync(content);
      
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);

      Alert.alert(
        'Copied!',
        `${format === 'text' ? 'VA-friendly summary' : 'JSON data'} copied to clipboard`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Clipboard error:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Export Data</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128, gap: 20 }}>
        {/* Date Range Selector */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-semibold text-foreground mb-3">Select Date Range</Text>
            <View className="flex-row gap-2">
              {(['7', '30', '90', 'all'] as DateRange[]).map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setDateRange(range)}
                  className="flex-1"
                >
                  <View
                    className={`py-2 px-3 rounded-lg border ${
                      dateRange === range
                        ? 'bg-primary border-primary'
                        : 'bg-card border-border'
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-medium ${
                        dateRange === range ? 'text-primary-foreground' : 'text-foreground'
                      }`}
                    >
                      {range === 'all' ? 'All' : `${range}d`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-xs text-muted-foreground mt-2">
              {filteredEntries.length} entries in selected range
            </Text>
          </CardContent>
        </Card>

        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-6 items-center">
              <FileText className="text-muted-foreground mb-3" size={48} />
              <Text className="text-lg font-semibold text-foreground text-center mb-2">
                No Entries Found
              </Text>
              <Text className="text-sm text-muted-foreground text-center">
                No symptom entries found in the selected date range. Try selecting a different range or log your first entry.
              </Text>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Export Options */}
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">Export Formats</Text>

              {/* VA-Friendly Text */}
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-start gap-3 mb-3">
                    <FileText className="text-primary mt-1" size={24} />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        VA-Friendly Summary
                      </Text>
                      <Text className="text-sm text-muted-foreground mt-1">
                        Human-readable format optimized for VA disability claims. Includes summary
                        statistics and detailed chronological entries.
                      </Text>
                    </View>
                  </View>
                  <Button
                    onPress={() => copyToClipboard('text')}
                    variant={copiedFormat === 'text' ? 'secondary' : 'default'}
                    fullWidth
                  >
                    <View className="flex-row items-center justify-center gap-2">
                      {copiedFormat === 'text' && <Check size={18} />}
                      <Text className={copiedFormat === 'text' ? 'text-secondary-foreground font-medium' : 'text-primary-foreground font-medium'}>
                        {copiedFormat === 'text' ? 'Copied!' : 'Copy Summary to Clipboard'}
                      </Text>
                    </View>
                  </Button>
                </CardContent>
              </Card>

              {/* JSON Export */}
              <Card>
                <CardContent className="p-4">
                  <View className="flex-row items-start gap-3 mb-3">
                    <Code className="text-primary mt-1" size={24} />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">JSON Data</Text>
                      <Text className="text-sm text-muted-foreground mt-1">
                        Machine-readable format for importing into other systems or backup purposes.
                        Includes all metadata and raw entry data.
                      </Text>
                    </View>
                  </View>
                  <Button
                    onPress={() => copyToClipboard('json')}
                    variant={copiedFormat === 'json' ? 'secondary' : 'default'}
                    fullWidth
                  >
                    <View className="flex-row items-center justify-center gap-2">
                      {copiedFormat === 'json' && <Check size={18} />}
                      <Text className={copiedFormat === 'json' ? 'text-secondary-foreground font-medium' : 'text-primary-foreground font-medium'}>
                        {copiedFormat === 'json' ? 'Copied!' : 'Copy JSON to Clipboard'}
                      </Text>
                    </View>
                  </Button>
                </CardContent>
              </Card>
            </View>

            {/* Info Card */}
            <Card>
              <CardContent className="p-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Export Tips</Text>
                <Text className="text-xs text-muted-foreground leading-5">
                  • The VA-friendly format is designed for easy reading by claims processors{'\n'}
                  • JSON format can be saved to a file for backup or data portability{'\n'}
                  • All timestamps include your local time zone for accuracy{'\n'}
                  • Export regularly to maintain a backup of your symptom log
                </Text>
              </CardContent>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}