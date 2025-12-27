import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Como agora você tem domínio próprio (razonete.app.br),
  // a base deve ser a raiz do domínio, ou seja, '/'
  base: '/', 
})
