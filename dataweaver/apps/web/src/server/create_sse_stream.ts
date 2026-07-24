import type { StreamEvent } from '~/server/types';

export type EmitFn = (event: StreamEvent) => void;

/**
 * Create an SSE `Response` that streams `StreamEvent` objects.
 *
 * The `handler` receives an `emit` function and the request's `AbortSignal`.
 * When the handler returns (or throws), the stream is closed automatically.
 */
export const createSSEResponse = (
  handler: (emit: EmitFn, signal: AbortSignal) => Promise<void>,
  signal: AbortSignal,
): Response => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit: EmitFn = (event) => {
        controller.enqueue(
          encoder.encode(
            `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
          ),
        );
      };

      try {
        await handler(emit, signal);
      } catch (err: unknown) {
        if (!signal.aborted) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          emit({ type: 'error', message });
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
};
