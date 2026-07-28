import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

type PackageJson = {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

function getExternalPackages(): string[] {
  const packageJsonPath = resolve(__dirname, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PackageJson

  return [
    ...new Set([...Object.keys(packageJson.peerDependencies ?? {}), ...Object.keys(packageJson.dependencies ?? {})]),
  ]
}

function isPackageExternal(id: string, externalPackages: string[]): boolean {
  return externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
}

function configLib(): UserConfig {
  const externalPackages = getExternalPackages()

  return {
    root: '.',
    plugins: [
      react(),
      dts({
        tsconfigPath: './tsconfig.json',
        include: ['src'],
        entryRoot: 'src',
        insertTypesEntry: true,
        bundleTypes: true,
        exclude: ['src/tests', '**/*.test.*'],
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.tsx'),
        formats: ['es'],
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: (id) => isPackageExternal(id, externalPackages),
      },
      outDir: resolve(__dirname, 'lib'),
      sourcemap: true,
      minify: true,
      emptyOutDir: true,
    },
  }
}

function configApp(): UserConfig {
  return {
    root: resolve(__dirname, 'demo'),
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: true,
      emptyOutDir: true,
    },
  }
}

export default defineConfig(({ mode }) => {
  const isLibraryBuild = mode === 'lib'

  return isLibraryBuild ? configLib() : configApp()
})
