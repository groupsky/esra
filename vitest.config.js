import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    ...configDefaults.test,
    environment: 'node',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})

