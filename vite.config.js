import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Substitua abaixo pelo nome do seu repositório GitHub
  // Exemplo: se o repo é 'meu-projeto', use base: '/meu-projeto/'
  base: '/razonete.app/', 
})
