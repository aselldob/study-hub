import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = 'https://mycnpfilqktphbcbxelm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15Y25wZmlscWt0cGhiY2J4ZWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MzM4NjEsImV4cCI6MjA1MTAwOTg2MX0.lzW9D_o88UxkhXiqmvKKJ4g6pA3rt3cfvTgpKp1ZOGs'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
