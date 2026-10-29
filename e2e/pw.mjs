// Loads Playwright from the project, or from a global install (e.g. a CI image that ships it).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require('playwright');
} catch {
  const globalRoot = process.env.PLAYWRIGHT_PATH ?? '/opt/node22/lib/node_modules/playwright';
  pw = require(globalRoot);
}
export const { chromium } = pw;
