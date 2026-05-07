import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjthvzxsziccpzrzvbdf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdGh2enhzemljY3B6cnp2YmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDE1NDYsImV4cCI6MjA5MjM3NzU0Nn0.eYTd-AXgZkmAsGKXJf2Px9WCjh9EkvA-umERM0S1hjY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);