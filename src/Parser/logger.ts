import Parser from "./index";
import debugFactory from "debug";

const debug = debugFactory("parser");

// Simple typescript decorator to remove
// all the login logic from the parser itself.
// This is essential to debug your parser, you need
// to visualize the call stack because that is
// actually your parser stack and one of the two main stateful
// mechanism of the parser (the other is the tokens)
export function logVT(message: string) {
  return (
    _target: Object,
    propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const method = descriptor.value;

    // wrap the VT method in debug statements.
    // Track when the method is called and when its recursive
    // calls are resolved
    descriptor.value = function (this: Parser, ...args: any[]) {
      const trackId = this.getTrackId();
      debug(
        `${trackId} ${propertyName}() ${message}. %o`,
        this.getTokenStack().map((t) => t.toString())
      );

      const result = method.apply(this, args);

      debug(`${trackId} ${propertyName}(): ${message}. return %o`, result);

      return result;
    };
    return descriptor;
  };
}
