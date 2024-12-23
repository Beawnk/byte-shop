import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://tnwvrtitkleeayjechmy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRud3ZydGl0a2xlZWF5amVjaG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MDI4OTQsImV4cCI6MjA1MDQ3ODg5NH0.-K0InfrhZqzt_zfpEhHKMjZNtgKbIIXd5bLAFzZARHc')