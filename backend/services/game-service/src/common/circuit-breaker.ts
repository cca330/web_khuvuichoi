export class CircuitBreaker {
  private failures = 0;
  private openedAt = 0;
  private halfOpenInFlight = false;

  constructor(
    private readonly failureThreshold = 3,
    private readonly resetTimeoutMs = 10000,
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }
    if (this.openedAt && this.halfOpenInFlight) {
      throw new Error('Circuit breaker is testing recovery');
    }
    if (this.openedAt) this.halfOpenInFlight = true;

    try {
      const result = await operation();
      this.failures = 0;
      this.openedAt = 0;
      this.halfOpenInFlight = false;
      return result;
    } catch (error) {
      this.failures += 1;
      if (this.failures >= this.failureThreshold) this.openedAt = Date.now();
      this.halfOpenInFlight = false;
      throw error;
    }
  }

  private isOpen() {
    if (!this.openedAt) return false;
    if (Date.now() - this.openedAt >= this.resetTimeoutMs) {
      return false;
    }
    return true;
  }
}
