// Supabase configuration
const SUPABASE_URL = "https://vyrbwxqriwrehxglwmku.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yZrgsdJj85irOcmd0y58ow_8QKorS2E";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
