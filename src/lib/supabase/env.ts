export type SupabaseEnvironment = { url: string; anonKey: string };
function value(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") { const v = process.env[name]; if (!v) throw new Error(`Missing required environment variable: ${name}`); return v; }
export function getSupabaseEnvironment(): SupabaseEnvironment { const url=value("NEXT_PUBLIC_SUPABASE_URL"); if (!URL.canParse(url)) throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"); return { url, anonKey:value("NEXT_PUBLIC_SUPABASE_ANON_KEY") }; }
export function hasSupabaseEnvironment() { return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); }
