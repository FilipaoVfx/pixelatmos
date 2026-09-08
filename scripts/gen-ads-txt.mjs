/**
 * Writes public/ads.txt from src/config/adsense.ts.
 * Run after changing PUBLISHER_ID:  npx tsx scripts/gen-ads-txt.mjs
 */
import fs from 'node:fs';
import { ADS_TXT } from '../src/config/adsense.ts';

fs.writeFileSync('public/ads.txt', ADS_TXT + '\n');
console.log(`wrote public/ads.txt: ${ADS_TXT}`);
