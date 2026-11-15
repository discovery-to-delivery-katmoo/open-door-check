import { createClient } from "@supabase/supabase-js";

// Publishable (anon) key: fine in the browser.
export const supabase = createClient(
  "https://abcdefghijklmnop.supabase.co",
  "sb_publishable_FAKE_EXAMPLE_not_a_real_key_9c1d"
);
