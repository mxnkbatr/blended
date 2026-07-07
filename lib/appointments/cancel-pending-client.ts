import { apiUrl } from "@/lib/api-base";

/** Cancel unpaid checkout when user leaves the booking flow. */
export function cancelPendingAppointmentClient(appointmentId: string): void {
  void fetch(apiUrl(`/api/appointments/?appointmentId=${appointmentId}`), {
    method: "DELETE",
    keepalive: true,
  }).catch(() => undefined);
}
