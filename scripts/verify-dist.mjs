/**
 * Post-build smoke check: dist layout and critical bundle strings.
 * Run: node scripts/verify-dist.mjs
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(process.cwd(), 'dist')
const errors = []

if (!existsSync(join(root, 'index.html'))) errors.push('dist/index.html missing')
if (!existsSync(join(root, 'assets'))) errors.push('dist/assets missing')
else {
  const assets = readdirSync(join(root, 'assets'))
  if (!assets.some((f) => f.endsWith('.js'))) errors.push('no .js chunk in dist/assets')
  if (!assets.some((f) => f.endsWith('.css'))) errors.push('no .css chunk in dist/assets')
}

if (existsSync(join(root, 'index.html'))) {
  const html = readFileSync(join(root, 'index.html'), 'utf8')
  if (!html.includes('id="root"')) errors.push('index.html missing #root mount')
  if (!html.includes('/assets/') || !html.includes('.js')) errors.push('index.html missing built /assets/*.js')
}

if (errors.length) {
  console.error('verify-dist FAILED:\n', errors.join('\n'))
  process.exit(1)
}

console.log('verify-dist: OK (dist layout + index.html)')
