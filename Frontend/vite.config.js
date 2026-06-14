/* global process */
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // VITE_SERVER_DOMAIN: your Backend Vercel URL
      // Set this in Frontend/.env or as a Vercel environment variable
      'import.meta.env.VITE_SERVER_DOMAIN': JSON.stringify(
        env.VITE_SERVER_DOMAIN || 'https://nsd-backend-8vtz.onrender.com'
      ),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || 'https://pggruahenklvcexwpvom.supabase.co'
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || ''
      ),
    }
  }
})
