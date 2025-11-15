import { DEFAULT_PAGE_SIZE } from './constants';

describe('Constants', () => {
  it('should have DEFAULT_PAGE_SIZE defined', () => {
    expect(DEFAULT_PAGE_SIZE).toBeDefined();
    expect(typeof DEFAULT_PAGE_SIZE).toBe('number');
    expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
  });
});
