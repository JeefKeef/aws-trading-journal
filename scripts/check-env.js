#!/usr/bin/env node

/**
 * Environment Setup Validator
 * Checks if all required environment variables are configured properly
 */

const fs = require('fs')
const path = require('path')

// Load .env.local manually (Next.js does this automatically at runtime)
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const [, key, value] = match
      process.env[key.trim()] = value.trim()
    }
  })
}

const requiredEnvVars = {
  // Supabase (Required for auth and database)
  NEXT_PUBLIC_SUPABASE_URL: {
    name: 'Supabase Project URL',
    example: 'https://xxxxx.supabase.co',
    required: true,
    validate: (val) => val?.startsWith('https://') && val?.includes('.supabase.co')
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    name: 'Supabase Anonymous Key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
    validate: (val) => val?.startsWith('eyJ') && val?.length > 100
  },
  
  // OpenAI (Required for chat functionality)
  OPENAI_API_KEY: {
    name: 'OpenAI API Key',
    example: 'sk-...',
    required: true,
    validate: (val) => val?.startsWith('sk-') && val?.length > 20
  },
  
  // Supabase Service Role (Optional but recommended for admin operations)
  SUPABASE_SERVICE_ROLE_KEY: {
    name: 'Supabase Service Role Key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
    validate: (val) => !val || (val?.startsWith('eyJ') && val?.length > 100)
  },
  
  // Stripe (Optional - for subscriptions)
  STRIPE_SECRET_KEY: {
    name: 'Stripe Secret Key',
    example: 'sk_test_... or sk_live_...',
    required: false,
    validate: (val) => !val || val?.startsWith('sk_')
  }
}

console.log('🔍 Checking environment configuration...\n')

let hasErrors = false
let hasWarnings = false

Object.entries(requiredEnvVars).forEach(([key, config]) => {
  const value = process.env[key]
  const isSet = !!value
  const isPlaceholder = value?.includes('placeholder') || value?.includes('your-') || value?.includes('replace-this')
  
  let status = '✅'
  let message = `${config.name}`
  
  if (!isSet) {
    if (config.required) {
      status = '❌'
      message += ` - MISSING (Required)`
      hasErrors = true
    } else {
      status = '⚪'
      message += ` - Not configured (Optional)`
    }
  } else if (isPlaceholder) {
    status = '⚠️ '
    message += ` - Using placeholder value`
    if (config.required) {
      hasErrors = true
      message += ` (Update with real value)`
    } else {
      hasWarnings = true
    }
  } else if (config.validate && !config.validate(value)) {
    status = '⚠️ '
    message += ` - Invalid format`
    hasWarnings = true
  } else {
    status = '✅'
    message += ` - Configured`
  }
  
  console.log(`${status} ${message}`)
  if (!isSet || isPlaceholder) {
    console.log(`   Example: ${config.example}`)
  }
  console.log()
})

console.log('─'.repeat(60))

if (hasErrors) {
  console.log('\n❌ ERRORS FOUND')
  console.log('Your application will not work properly without these values.')
  console.log('\n📖 Follow the setup guide: PHASE_1_SETUP_GUIDE.md')
  console.log('   1. Create a Supabase project at https://supabase.com')
  console.log('   2. Copy your Project URL and API keys')
  console.log('   3. Update .env.local with real values')
  console.log('   4. Restart your dev server')
  process.exit(1)
} else if (hasWarnings) {
  console.log('\n⚠️  WARNINGS')
  console.log('Some optional features may not work.')
  console.log('Update .env.local if you need these features.')
  process.exit(0)
} else {
  console.log('\n✅ ALL CHECKS PASSED')
  console.log('Your environment is properly configured!')
  process.exit(0)
}
