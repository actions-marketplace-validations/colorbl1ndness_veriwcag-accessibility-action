import fs from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const url = process.env.TARGET_URL;
const failOnCritical = process.env.FAIL_ON_CRITICAL === 'true';
if (!url) throw new Error('TARGET_URL is required');

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of results.violations) {
    if (counts[v.impact] !== undefined) counts[v.impact] += 1;
  }

  const md = [
    `## VeriWCAG Accessibility CI Summary`,
    `Target: \`${url}\``,
    ``,
    `| Impact | Violations |`,
    `| --- | ---: |`,
    `| Critical | ${counts.critical} |`,
    `| Serious | ${counts.serious} |`,
    `| Moderate | ${counts.moderate} |`,
    `| Minor | ${counts.minor} |`,
    ``,
    `Need scheduled production monitoring, HTML/ARIA patches, and timestamped VPAT-foundation PDFs?`,
    `[Track continuously on VeriWCAG →](https://veriwcag.com/?utm_source=github_action)`,
  ].join('\n');

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);
  } else {
    console.log(md);
  }

  if (failOnCritical && counts.critical > 0) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
