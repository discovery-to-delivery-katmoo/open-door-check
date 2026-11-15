import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const event = await req.json();

  if (event.type === "checkout.session.completed") {
    const userId = event.data.object.client_reference_id;
    await supabase.from("profiles").update({ role: "paid" }).eq("id", userId);
  }

  return new Response("ok");
});
