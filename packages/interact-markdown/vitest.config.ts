/// <reference types="vitest" />
/// <reference types="vite/client" />
import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true, // for jest expect global used by testing library
        setupFiles: './__test__/vitest-setup.ts',
    }
})
