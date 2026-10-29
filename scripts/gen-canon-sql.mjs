// Generates supabase/migrations/002_canon.sql from the game content.
// Run after changing any case content: npm run gen:canon
import { writeFileSync } from 'node:fs';
import { buildCanonSql } from '../src/events/canonSql.js';

writeFileSync(new URL('../supabase/migrations/002_canon.sql', import.meta.url), buildCanonSql());
console.log('wrote supabase/migrations/002_canon.sql');

