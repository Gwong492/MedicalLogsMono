import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const KEYS = {
  PROFILE: "@vet_logger_profile",
  PAIN_ENTRIES: "@vet_logger_pain",
  HEADACHE_ENTRIES: "@vet_logger_headache",
  BP_ENTRIES: "@vet_logger_bp",
  CYCLE_ENTRIES: "@vet_logger_cycle",
  ONBOARDING_COMPLETE: "@vet_logger_onboarding",
};

// Type definitions
export type Profile = {
  fullName: string;
  timeZone: string;
  notes?: string;
};

export type PainEntry = {
  id: string;
  type: "pain";
  dateTime: string;
  painLevel: number;
  location: string;
  bodyRegion: string;
  painType: string;
  duration: number;
  triggers: string;
  functionalImpact: {
    sleep: boolean;
    work: boolean;
    walking: boolean;
    lifting: boolean;
  };
  medications: string;
  reliefPercent: number;
  notes: string;
};

export type HeadacheEntry = {
  id: string;
  type: "headache";
  startDateTime: string;
  endDateTime?: string;
  intensity: number;
  symptoms: string[];
  triggers: string;
  medications: string;
  reliefPercent: number;
  requiredLyingDown: boolean;
  missedWork: boolean;
  notes: string;
};

export type BloodPressureEntry = {
  id: string;
  type: "bloodPressure";
  dateTime: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  posture: "sitting" | "standing";
  armUsed: "left" | "right";
  deviceType: string;
  notes: string;
};

export type CycleEntry = {
  id: string;
  type: "cycle";
  startDate: string;
  endDate?: string;
  flowIntensity: "spotting" | "light" | "medium" | "heavy";
  symptoms: string[];
  painLevel: number;
  mood: string[];
  notes: string;
};

export type Entry = PainEntry | HeadacheEntry | BloodPressureEntry | CycleEntry;

// Profile operations
export const loadProfile = async (): Promise<Profile | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
};

export const saveProfile = async (profile: Profile): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving profile:", error);
  }
};

// Entry operations
export const loadPainEntries = async (): Promise<PainEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PAIN_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading pain entries:", error);
    return [];
  }
};

export const loadHeadacheEntries = async (): Promise<HeadacheEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.HEADACHE_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading headache entries:", error);
    return [];
  }
};

export const loadBPEntries = async (): Promise<BloodPressureEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BP_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading BP entries:", error);
    return [];
  }
};

export const loadCycleEntries = async (): Promise<CycleEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CYCLE_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading cycle entries:", error);
    return [];
  }
};

export const loadAllEntries = async (): Promise<Entry[]> => {
  const [pain, headache, bp, cycle] = await Promise.all([
    loadPainEntries(),
    loadHeadacheEntries(),
    loadBPEntries(),
    loadCycleEntries(),
  ]);
  return [...pain, ...headache, ...bp, ...cycle].sort((a, b) => {
    const dateA =
      a.type === "headache"
        ? a.startDateTime
        : a.type === "cycle"
          ? a.startDate
          : a.dateTime;
    const dateB =
      b.type === "headache"
        ? b.startDateTime
        : b.type === "cycle"
          ? b.startDate
          : b.dateTime;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};

export const savePainEntry = async (entry: PainEntry): Promise<void> => {
  try {
    const entries = await loadPainEntries();
    const index = entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    await AsyncStorage.setItem(KEYS.PAIN_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving pain entry:", error);
  }
};

export const saveHeadacheEntry = async (
  entry: HeadacheEntry
): Promise<void> => {
  try {
    const entries = await loadHeadacheEntries();
    const index = entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    await AsyncStorage.setItem(KEYS.HEADACHE_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving headache entry:", error);
  }
};

export const saveBPEntry = async (entry: BloodPressureEntry): Promise<void> => {
  try {
    const entries = await loadBPEntries();
    const index = entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    await AsyncStorage.setItem(KEYS.BP_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving BP entry:", error);
  }
};

export const deletePainEntry = async (id: string): Promise<void> => {
  try {
    const entries = await loadPainEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEYS.PAIN_ENTRIES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting pain entry:", error);
  }
};

export const deleteHeadacheEntry = async (id: string): Promise<void> => {
  try {
    const entries = await loadHeadacheEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEYS.HEADACHE_ENTRIES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting headache entry:", error);
  }
};

export const deleteBPEntry = async (id: string): Promise<void> => {
  try {
    const entries = await loadBPEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEYS.BP_ENTRIES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting BP entry:", error);
  }
};

export const saveCycleEntry = async (entry: CycleEntry): Promise<void> => {
  try {
    const entries = await loadCycleEntries();
    const index = entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    await AsyncStorage.setItem(KEYS.CYCLE_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving cycle entry:", error);
  }
};

export const deleteCycleEntry = async (id: string): Promise<void> => {
  try {
    const entries = await loadCycleEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEYS.CYCLE_ENTRIES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting cycle entry:", error);
  }
};

// Onboarding
export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
    return data === "true";
  } catch (error) {
    return false;
  }
};

export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, "true");
  } catch (error) {
    console.error("Error setting onboarding complete:", error);
  }
};

// Utility: Generate UUID
export const generateId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Utility: Get today's entries count
export const getTodayEntriesCount = async (): Promise<{
  pain: number;
  headache: number;
  bp: number;
  cycle: number;
}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const [pain, headache, bp, cycle] = await Promise.all([
    loadPainEntries(),
    loadHeadacheEntries(),
    loadBPEntries(),
    loadCycleEntries(),
  ]);

  const painCount = pain.filter((e) => new Date(e.dateTime) >= today).length;
  const headacheCount = headache.filter(
    (e) => new Date(e.startDateTime) >= today
  ).length;
  const bpCount = bp.filter((e) => new Date(e.dateTime) >= today).length;
  const cycleCount = cycle.filter((e) => new Date(e.startDate) >= today).length;

  return {
    pain: painCount,
    headache: headacheCount,
    bp: bpCount,
    cycle: cycleCount,
  };
};
