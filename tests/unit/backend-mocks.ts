import { vi } from 'vitest';

/**
 * Module-level backend mocks for the Vitest harness (plan, Testing rule 1):
 * `@/calls`, `useSSE` and `WebSocketHook` never touch the network, and
 * `next/navigation` works outside a real Next app.
 */

/** Mock for `@/calls`: every backend call resolves successfully with fixed data. */
export function callsMock() {
  return {
    fetchGamesAvailability: vi
      .fn()
      .mockResolvedValue({ chsh: true, qf: true, ssm: true }),
    chshPost: vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ chsh_value: 2.62, chsh_error: 0.05 }),
    }),
    submitFortune: vi.fn().mockResolvedValue({ success: true, data: [2] }),
    ssmPost: vi
      .fn()
      .mockResolvedValue({ status: 200, json: () => Promise.resolve({}) }),
    fetchRotatorAngle: vi.fn().mockResolvedValue({ success: true, theta: 45 }),
    resetBackendState: vi.fn().mockResolvedValue(undefined),
    requestFollower: vi.fn().mockResolvedValue({ success: true, data: {} }),
    fetchQuestionOrder: vi
      .fn()
      .mockResolvedValue({ success: true, questionOrder: [1, 2, 3, 4, 5] }),
    submitSSMAnswers: vi.fn().mockResolvedValue({
      success: true,
      data: {
        n_matching_bits: 5,
        n_total_bits: 5,
        emoji: '😂',
        role: 'leader',
      },
    }),
    submitQKDEmoji: vi.fn().mockResolvedValue({ success: true, data: {} }),
  };
}

/** Mock for `@/hooks/useSSE`: connected, no message, no error. */
export function useSSEMock() {
  return {
    useSSE: vi.fn(() => ({
      lastMessage: null,
      isConnected: true,
      error: null,
    })),
  };
}

/** Mock for `@/hooks/WebSocketHook`: an open socket that stays silent. */
export function useWebSocketMock() {
  return {
    useWebSocket: vi.fn(() => ({
      lastMessage: null,
      sendMessage: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
      isConnected: true,
    })),
  };
}

/** Mock for `next/navigation`: a router that records where it was asked to go. */
export function navigationMock() {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
  return {
    useRouter: vi.fn(() => router),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => new URLSearchParams()),
  };
}
