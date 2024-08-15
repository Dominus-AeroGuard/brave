interface Handler<T> {
  setNext(handler: Handler<T>): Handler<T>;
  handle(request: T);
}
