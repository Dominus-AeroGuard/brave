interface Handler {
  setNext(handler: Handler): Handler;
  handle<T>(request: T): T;
}
