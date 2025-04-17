import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const adminClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default adminClient
