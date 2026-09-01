/**
 * Shown while a route chunk is downloading.
 *
 * Deliberately matches the site background so a route change reads as an
 * instant transition rather than a white flash. No spinner for the first
 * ~300ms — a spinner that appears and vanishes feels slower than nothing.
 */
export default function RouteFallback() {
  return (
    <div
      className="min-h-screen w-full bg-background flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 rounded-full border-2 border-[#837FFB]/25 border-t-[#837FFB] animate-spin opacity-0 animate-[fade-in_0.2s_ease-out_0.3s_forwards]" />
    </div>
  );
}
