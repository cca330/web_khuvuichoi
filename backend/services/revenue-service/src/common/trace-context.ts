import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage<string>();

export const runWithTraceId = (traceId: string, next: () => void) =>
  storage.run(traceId, next);

export const getTraceId = () => storage.getStore();
