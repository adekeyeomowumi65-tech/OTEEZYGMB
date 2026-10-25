const SUPABASE_URL = "https://bgtbxvfqzssllaiktaau.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_h3sUzxA-I7za-S6ry7RuLA_qkB5iYvb";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function loadHomepage() {
  if (!document.getElementById("heroTitle")) return; // only index.html needs homepage data
  const { data, error } = await supabaseClient

    .from("homepage")
    .select("*")
    .single();
  
  if (error) {
    console.error(error);
    return;
  }
  
  document.getElementById("heroTitle").textContent =
    data.hero_title;
  
  document.getElementById("heroSubtitle").textContent =
    data.hero_subtitle;
  
  document.getElementById("heroQuote").textContent =
    data.featured_quote;
}

loadHomepage();