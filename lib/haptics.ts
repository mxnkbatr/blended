import { Capacitor } from "@capacitor/core";

async function runHaptic(fn: () => Promise<void>) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await fn();
  } catch {
    // Haptics unavailable
  }
}

export async function hapticLight() {
  await runHaptic(async () => {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  });
}

export async function hapticMedium() {
  await runHaptic(async () => {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Medium });
  });
}

export async function hapticSelection() {
  await runHaptic(async () => {
    const { Haptics } = await import("@capacitor/haptics");
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  });
}

export async function hapticSuccess() {
  await runHaptic(async () => {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  });
}

export async function hapticError() {
  await runHaptic(async () => {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Error });
  });
}
