import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		allowedHosts: true,
		watch: {
			usePolling: true,
		},
		hmr: {
			clientPort: 5173,
		},
		proxy: {
			'/api': {
				target: 'http://backend:3000',
				changeOrigin: true,
			},
		},
	},
})
