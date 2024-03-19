import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    solid(),
    legacy({
      targets: ['chrome 53'],
    })
  ],
})
