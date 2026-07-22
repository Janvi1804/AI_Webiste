import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('documents route has exactly one default export', () => {
  const source = readFileSync('src/app/app/documents/page.tsx', 'utf8');
  const matches = source.match(/export\s+default/g) ?? [];
  assert.equal(matches.length, 1);
});
