import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://shvmrjlareaoypywmomo.supabase.co";
const supabaseAnonKey = "sb_publishable_ZewILaZMEKLxCohSfdBeew_chc8gQ2p";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);