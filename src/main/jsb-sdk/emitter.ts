class EventEmitter {
  callbacks = new Map<string, Function[]>();

  on = (eventName: string, callback: any) => {
    if (!this.callbacks.has(eventName)) {
      this.callbacks.set(eventName, [callback]);
      return;
    }

    const currentEventCallbacks = this.callbacks.get(eventName) ?? [];
    currentEventCallbacks.forEach((cb) => {
      if (cb === callback) {
        return new Error('Try dupucate resgite callback');
      }
    });

    currentEventCallbacks.push(callback);
    this.callbacks.set(eventName, currentEventCallbacks);
  };

  emit = (eventName: string, ...args: unknown[]) => {
    if (!this.callbacks.has(eventName)) {
      return;
    }

    const currentEventCallbacks = this.callbacks.get(eventName)!;
    currentEventCallbacks.forEach((cb) => {
      cb(...args);
    });
  };

  once = (eventName: string, callback: any) => {
    const executer = (...args: any[]) => {
      this.unsubscribe(eventName, executer);
      callback(...args);
    };
    this.on(eventName, executer);
  };

  unsubscribe = (eventName: string, callback: any) => {
    if (!this.callbacks.has(eventName)) {
      return;
    }

    const currentEventCallbacks = this.callbacks.get(eventName)!;
    const leftCallbacks = currentEventCallbacks.filter((cb) => cb !== callback);
    if (leftCallbacks.length === 0) {
      this.callbacks.delete(eventName);
      return;
    }
    this.callbacks.set(eventName, leftCallbacks);
  };
}

export default EventEmitter;
