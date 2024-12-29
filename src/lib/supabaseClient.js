import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	'https://tnwvrtitkleeayjechmy.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRud3ZydGl0a2xlZWF5amVjaG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDkwMjg5NCwiZXhwIjoyMDUwNDc4ODk0fQ.361_IfTGqxa5DhsoG4mBseSUasoAgCFj6CNTEEVg0xI'
)