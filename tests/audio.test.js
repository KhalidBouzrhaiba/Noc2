import { describe, it, expect } from 'vitest';
import { audio } from '../src/core/audio.js';

describe('sound setting', () => {
  it('produces no audio when disabled', () => {
    audio.setEnabled(false);
    expect(audio.unlock()).toBe(false);
    expect(audio.ready()).toBeFalsy();
    expect(() => audio.play('discover')).not.toThrow();
    expect(() => audio.loop('wind')).not.toThrow();
    expect(audio.loops.size).toBe(0);
  });
});
