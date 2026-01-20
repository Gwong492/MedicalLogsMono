import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Calendar, ChevronRight, Activity, Heart, Thermometer } from 'lucide-react-native';
import { Card, CardContent } from '@/components/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  loadAllEntries, 
  type Entry, 
  type PainEntry, 
  type HeadacheEntry, 
  type BloodPressureEntry 
} from '@/lib/storage';

type FilterType = 'all' | 'pain' | 'headache' | 'bloodPressure';
type DateRangeType = '7' | '30' | '90' | 'custom';

export default function TimelineScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [dateRange, setDateRange] = useState<DateRangeType>('30');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const allEntries = await loadAllEntries();
    setEntries(allEntries);
    setLoading(false);
  };

  // Filter by type
  const typeFilteredEntries = useMemo(() => {
    if (filterType === 'all') return entries;
    return entries.filter(entry => entry.type === filterType);
  }, [entries, filterType]);

  // Filter by date range
  const dateFilteredEntries = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (dateRange) {
      case '7':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'custom':
        // For now, custom shows all. In a full implementation, this would open a date picker
        return typeFilteredEntries;
    }

    return typeFilteredEntries.filter(entry => {
      const entryDate = new Date(getEntryDateTime(entry));
      return entryDate >= cutoffDate;
    });
  }, [typeFilteredEntries, dateRange]);

  // Search filter
  const searchFilteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return dateFilteredEntries;

    const query = searchQuery.toLowerCase();
    return dateFilteredEntries.filter(entry => {
      const searchableText = getSearchableText(entry).toLowerCase();
      return searchableText.includes(query);
    });
  }, [dateFilteredEntries, searchQuery]);

  // Sort by date (newest first)
  const sortedEntries = useMemo(() => {
    return [...searchFilteredEntries].sort((a, b) => {
      const dateA = new Date(getEntryDateTime(a)).getTime();
      const dateB = new Date(getEntryDateTime(b)).getTime();
      return dateB - dateA;
    });
  }, [searchFilteredEntries]);

  const getEntryDateTime = (entry: Entry): string => {
    if (entry.type === 'headache') {
      return entry.startDateTime;
    }
    return entry.dateTime;
  };

  const getSearchableText = (entry: Entry): string => {
    let text = '';
    if (entry.type === 'pain') {
      text = `${entry.location} ${entry.bodyRegion} ${entry.painType} ${entry.triggers} ${entry.medications} ${entry.notes}`;
    } else if (entry.type === 'headache') {
      text = `${entry.symptoms.join(' ')} ${entry.triggers} ${entry.medications} ${entry.notes}`;
    } else if (entry.type === 'bloodPressure') {
      text = `${entry.posture} ${entry.armUsed} ${entry.deviceType} ${entry.notes}`;
    }
    return text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const handleEntryPress = (entry: Entry) => {
    if (entry.type === 'pain') {
      router.push(`/pain-entry?id=${entry.id}`);
    } else if (entry.type === 'headache') {
      router.push(`/headache-entry?id=${entry.id}`);
    } else if (entry.type === 'bloodPressure') {
      router.push(`/bp-entry?id=${entry.id}`);
    }
  };

  const renderEntryCard = (entry: Entry) => {
    if (entry.type === 'pain') {
      const painEntry = entry as PainEntry;
      return (
        <TouchableOpacity key={entry.id} onPress={() => handleEntryPress(entry)}>
          <Card className="mb-3">
            <CardContent className="py-4">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                    <Activity className="text-rose-600 dark:text-rose-400" size={18} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">Pain Log</Text>
                    <Text className="text-sm text-muted-foreground">{formatDate(painEntry.dateTime)}</Text>
                  </View>
                </View>
                <ChevronRight className="text-muted-foreground" size={20} />
              </View>
              
              <View className="gap-2 mt-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-medium text-foreground">Level:</Text>
                  <View className={`px-2 py-1 rounded ${
                    painEntry.painLevel >= 7 ? 'bg-red-100 dark:bg-red-900/30' :
                    painEntry.painLevel >= 4 ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      painEntry.painLevel >= 7 ? 'text-red-700 dark:text-red-400' :
                      painEntry.painLevel >= 4 ? 'text-amber-700 dark:text-amber-400' :
                      'text-green-700 dark:text-green-400'
                    }`}>
                      {painEntry.painLevel}/10
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-foreground">
                  <Text className="font-medium">Location:</Text> {painEntry.location} ({painEntry.bodyRegion})
                </Text>
                <Text className="text-sm text-foreground">
                  <Text className="font-medium">Type:</Text> {painEntry.painType}
                </Text>
                {painEntry.medications && (
                  <Text className="text-sm text-muted-foreground">
                    💊 {painEntry.medications}
                  </Text>
                )}
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      );
    }

    if (entry.type === 'headache') {
      const headacheEntry = entry as HeadacheEntry;
      return (
        <TouchableOpacity key={entry.id} onPress={() => handleEntryPress(entry)}>
          <Card className="mb-3">
            <CardContent className="py-4">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <Thermometer className="text-purple-600 dark:text-purple-400" size={18} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">Headache Log</Text>
                    <Text className="text-sm text-muted-foreground">{formatDate(headacheEntry.startDateTime)}</Text>
                  </View>
                </View>
                <ChevronRight className="text-muted-foreground" size={20} />
              </View>
              
              <View className="gap-2 mt-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-medium text-foreground">Intensity:</Text>
                  <View className={`px-2 py-1 rounded ${
                    headacheEntry.intensity >= 7 ? 'bg-red-100 dark:bg-red-900/30' :
                    headacheEntry.intensity >= 4 ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      headacheEntry.intensity >= 7 ? 'text-red-700 dark:text-red-400' :
                      headacheEntry.intensity >= 4 ? 'text-amber-700 dark:text-amber-400' :
                      'text-green-700 dark:text-green-400'
                    }`}>
                      {headacheEntry.intensity}/10
                    </Text>
                  </View>
                </View>
                {headacheEntry.symptoms.length > 0 && (
                  <Text className="text-sm text-foreground">
                    <Text className="font-medium">Symptoms:</Text> {headacheEntry.symptoms.join(', ')}
                  </Text>
                )}
                {headacheEntry.requiredLyingDown && (
                  <Text className="text-sm text-amber-600 dark:text-amber-400">🛏️ Required lying down</Text>
                )}
                {headacheEntry.missedWork && (
                  <Text className="text-sm text-red-600 dark:text-red-400">⚠️ Missed work</Text>
                )}
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      );
    }

    if (entry.type === 'bloodPressure') {
      const bpEntry = entry as BloodPressureEntry;
      const isHighBP = bpEntry.systolic >= 140 || bpEntry.diastolic >= 90;
      return (
        <TouchableOpacity key={entry.id} onPress={() => handleEntryPress(entry)}>
          <Card className="mb-3">
            <CardContent className="py-4">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Heart className="text-blue-600 dark:text-blue-400" size={18} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">Blood Pressure Log</Text>
                    <Text className="text-sm text-muted-foreground">{formatDate(bpEntry.dateTime)}</Text>
                  </View>
                </View>
                <ChevronRight className="text-muted-foreground" size={20} />
              </View>
              
              <View className="gap-2 mt-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl font-bold text-foreground">
                    {bpEntry.systolic}/{bpEntry.diastolic}
                  </Text>
                  <Text className="text-sm text-muted-foreground">mmHg</Text>
                  {isHighBP && (
                    <View className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                      <Text className="text-xs font-semibold text-red-700 dark:text-red-400">HIGH</Text>
                    </View>
                  )}
                </View>
                {bpEntry.pulse && (
                  <Text className="text-sm text-foreground">
                    <Text className="font-medium">Pulse:</Text> {bpEntry.pulse} bpm
                  </Text>
                )}
                <Text className="text-sm text-muted-foreground">
                  {bpEntry.posture.charAt(0).toUpperCase() + bpEntry.posture.slice(1)} • {bpEntry.armUsed.charAt(0).toUpperCase() + bpEntry.armUsed.slice(1)} arm
                </Text>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">Loading entries...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Timeline</Text>
        <ThemeToggle />
      </View>

      {/* Search Bar */}
      <View className="px-6 py-3 border-b border-border">
        <View className="flex-row items-center bg-muted rounded-lg px-3 py-2">
          <Search className="text-muted-foreground mr-2" size={20} />
          <TextInput
            className="flex-1 text-foreground"
            placeholder="Search notes, locations, medications..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Type Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12, gap: 8 }}
        className="border-b border-border"
      >
        {[
          { key: 'all', label: 'All' },
          { key: 'pain', label: 'Pain' },
          { key: 'headache', label: 'Headache' },
          { key: 'bloodPressure', label: 'Blood Pressure' },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            onPress={() => setFilterType(key as FilterType)}
            className={`px-4 py-2 rounded-full ${
              filterType === key
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          >
            <Text className={`font-medium ${
              filterType === key
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            }`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date Range Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12, gap: 8 }}
        className="border-b border-border"
      >
        <Calendar className="text-muted-foreground mr-2" size={20} />
        {[
          { key: '7', label: 'Last 7 days' },
          { key: '30', label: 'Last 30 days' },
          { key: '90', label: 'Last 90 days' },
          { key: 'custom', label: 'All Time' },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            onPress={() => setDateRange(key as DateRangeType)}
            className={`px-4 py-2 rounded-full ${
              dateRange === key
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          >
            <Text className={`text-sm font-medium ${
              dateRange === key
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            }`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Entries List */}
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
        {sortedEntries.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Activity className="text-muted-foreground mb-4" size={48} />
            <Text className="text-xl font-bold text-foreground text-center mb-2">
              No Entries Found
            </Text>
            <Text className="text-muted-foreground text-center">
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Start logging your symptoms to see them here'
              }
            </Text>
          </View>
        ) : (
          <View>
            <Text className="text-sm font-medium text-muted-foreground mb-3">
              {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
            </Text>
            {sortedEntries.map(renderEntryCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}