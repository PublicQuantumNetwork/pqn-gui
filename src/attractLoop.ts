/**
 * Shared surface for the attract loop (see CONTEXT.md).
 *
 * `HeaderBar` renders inside the root layout while `AttractLoop` is mounted by
 * the home page, so they sit in different React subtrees and cannot share state
 * through props or a common provider without lifting the page's follow-request
 * and availability state into the layout. The crossing is one fire-and-forget
 * command, so it travels as a window event — declared here rather than inline so
 * both sides reference the same name and the contract is discoverable.
 */

const SHOW_REQUEST_EVENT = 'pqn:show-attract-loop';

const DEFAULT_IDLE_SECONDS = 60;

/**
 * How long a node sits on the home page before the attract loop plays, and the
 * wait between passes. Zero disables the attract loop entirely.
 */
export function attractIdleMs(): number {
  const configured = Number(process.env.NEXT_PUBLIC_ATTRACT_IDLE_SECONDS);
  const seconds = Number.isFinite(configured)
    ? configured
    : DEFAULT_IDLE_SECONDS;
  return seconds * 1000;
}

/** True when this node is configured to show an attract loop at all. */
export function attractLoopEnabled(): boolean {
  return attractIdleMs() > 0;
}

/** Ask the attract loop to play now, skipping the idle delay. */
export function requestAttractLoop(): void {
  window.dispatchEvent(new Event(SHOW_REQUEST_EVENT));
}

/** Listen for `requestAttractLoop`. Returns an unsubscribe function. */
export function subscribeToAttractRequests(handler: () => void): () => void {
  window.addEventListener(SHOW_REQUEST_EVENT, handler);
  return () => window.removeEventListener(SHOW_REQUEST_EVENT, handler);
}
