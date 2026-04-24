import AsyncStorage from '@react-native-async-storage/async-storage';

export type BookingReceipt = {
  barberId: string;
  barberName: string;
  barberTitle: string;
  dateIso: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  phone: string;
  createdAtIso: string;
};

const STORAGE_KEY = 'blended:booking:last:v1';

export async function loadLastBooking(): Promise<BookingReceipt | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as any;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.barberId || !parsed.dateIso || !parsed.time) return null;
    return {
      barberId: String(parsed.barberId),
      barberName: String(parsed.barberName ?? ''),
      barberTitle: String(parsed.barberTitle ?? ''),
      dateIso: String(parsed.dateIso),
      time: String(parsed.time),
      name: String(parsed.name ?? ''),
      phone: String(parsed.phone ?? ''),
      createdAtIso: String(parsed.createdAtIso ?? new Date().toISOString()),
    };
  } catch {
    return null;
  }
}

export async function saveLastBooking(receipt: BookingReceipt): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
  } catch {
    // ignore
  }
}

export async function clearLastBooking(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

