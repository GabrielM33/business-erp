// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uzpnyogqlqvbcxckiflw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cG55b2dxbHF2YmN4Y2tpZmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzE4OTMsImV4cCI6MjA2MDIwNzg5M30.cMPfEJAaxXcPFGcV9oNWPC-92LBu1HFus2-dbGAEdbE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);