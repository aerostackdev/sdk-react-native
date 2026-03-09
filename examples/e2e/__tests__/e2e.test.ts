/**
 * React Native SDK E2E Tests
 *
 * Verifies the thin wrapper exports and SDK initialization.
 */
import { describe, it, expect, vi } from 'vitest';

// Mock generated APIs since they're not built
vi.mock('@aerostack/sdk-react-native/sdk', async () => {
  class MockConfiguration {
    constructor(public opts: any) {}
  }
  class MockSDK {
    auth = {};
    ai = {};
    storage = {};
    database = {};
    realtime = {};
    constructor(public options: any) {}
    setApiKey() {}
  }
  return {
    SDK: MockSDK,
    Aerostack: MockSDK,
    createClient: (opts: any) => new MockSDK(opts),
  };
});

describe('React Native SDK E2E', () => {
  it('should export SDK class', async () => {
    const { SDK } = await import('@aerostack/sdk-react-native');
    expect(SDK).toBeDefined();
  });

  it('should export Aerostack alias', async () => {
    const { Aerostack } = await import('@aerostack/sdk-react-native');
    expect(Aerostack).toBeDefined();
  });

  it('should export createClient factory', async () => {
    const { createClient } = await import('@aerostack/sdk-react-native');
    expect(typeof createClient).toBe('function');
  });

  it('should create SDK instance', async () => {
    const { SDK } = await import('@aerostack/sdk-react-native');
    const sdk = new SDK({ apiKey: 'test-key' });
    expect(sdk).toBeDefined();
    expect(sdk.auth).toBeDefined();
    expect(sdk.ai).toBeDefined();
    expect(sdk.storage).toBeDefined();
  });
});
