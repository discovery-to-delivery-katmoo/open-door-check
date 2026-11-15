import { createClient } from "@supabase/supabase-js";

// Used by the Admin page to list every booking.
export const adminClient = createClient(
  "https://abcdefghijklmnop.supabase.co",
  "sb_secret_FAKE_EXAMPLE_not_a_real_key_4f2a"
);

export async function listAllBookings() {
  const { data } = await adminClient.from("bookings").select("*");
  return data ?? [];
}
