import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	ssr: {
		external: ['vue'],
		noExternal: ['fsevents'],
	},
	optimizeDeps: {
		exclude: ['fsevents'],
	},
})
