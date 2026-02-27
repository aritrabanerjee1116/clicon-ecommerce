import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ycqhtgrbizxtqrajzajs.supabase.co',
  'sb_publishable_pn7hVyJqSn-BrLOTLT8Qmw_NUGeXZWo'
)

export async function promoteToAdmin(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error

  console.log('[promoteToAdmin] updated profile:', data)

  return data
}

// ---- EXECUTION BLOCK ----

async function run() {
  try {
    console.log('Script started')

    const USER_ID = '1601e1ac-ff17-488a-9afe-196056b1bf23'

    const row = await promoteToAdmin(USER_ID)

    console.log('Returned row:', row)
  } catch (err) {
    console.error('Script failed:', err)
  }
}

run()