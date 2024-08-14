interface Handler<T> {
  setRequest(request: T);
  setNext(handler: Handler<T>): Handler<T>;
  handle();
}
