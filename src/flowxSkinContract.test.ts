import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('FlowX skin token contract', () => {
  const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

  it('defines the body skin hook and brand accent tokens', () => {
    expect(css).toContain("body[data-skin='flowx']");
    expect(css).toContain('--brand-accent:');
    expect(css).toContain('--brand-accent-soft:');
    expect(css).toContain('--brand-accent-strong:');
  });

  it('keeps locked market signal tokens separate from customizable trade colors', () => {
    expect(css).toContain('--color-buy: #22c55e');
    expect(css).toContain('--color-sell: #ef4444');
    expect(css).toContain('--color-buy-locked: #22c55e');
    expect(css).toContain('--color-sell-locked: #ef4444');
    expect(css).toContain('--color-signal-locked: #38bdf8');
    expect(css).toContain('--market-buy-locked: var(--color-buy-locked)');
    expect(css).toContain('--market-sell-locked: var(--color-sell-locked)');
    expect(css).toContain('--market-signal-locked: var(--color-signal-locked)');
  });
});
