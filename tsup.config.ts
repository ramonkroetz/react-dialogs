import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ['esm', 'cjs'],
  platform: 'browser',
  minify: true,
  tsconfig: 'tsconfig.json',
  injectStyle: false,
})
