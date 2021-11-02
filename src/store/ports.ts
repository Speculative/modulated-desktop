import { Subject, Subscription } from "rxjs";
import { types, Instance } from "mobx-state-tree";
import { observable } from "mobx";

export function portID(windowName: string, portName: string) {
  return `${windowName}:${portName}`;
}

const PortConfig = types.model({
  id: types.identifier,
  type: types.literal("Number"), // types.enumeration(["Number"]),
});

const Connection = types.model({
  from: types.reference(PortConfig),
  to: types.reference(PortConfig),
});

export const Ports = types
  .model({
    inputs: types.map(PortConfig),
    outputs: types.map(PortConfig),
    connections: types.array(Connection),
  })
  .volatile(() => ({
    // Port ID -> Subject
    toStreams: observable.map<string, Subject<unknown>>({}),
    fromStreams: observable.map<string, Subject<unknown>>({}),
  }))
  .views((self) => {
    function connectionsTo(portID: string) {
      return self.connections
        .filter((connection) => connection.to.id === portID)
        .map((connection) => connection.to);
    }

    function connectionsFrom(portID: string) {
      return self.connections
        .filter((connection) => connection.from.id === portID)
        .map((connection) => connection.from);
    }

    return {
      connectionsTo,
      connectionsFrom,
    };
  })
  .actions((self) => {
    const subscriptions: { [connectionID: string]: Subscription } = {};

    function connectionID(from: string, to: string) {
      return `${from}->${to}}`;
    }

    function plug(from: string, to: string) {
      const from$ = self.fromStreams.get(from);
      const to$ = self.toStreams.get(to);
      if (!from$ || !to$) {
        throw new Error(`Cannot connect ${from} -> ${to}`);
      }

      self.connections.push({ from, to });
      subscriptions[connectionID(from, to)] = from$.subscribe(to$);
    }

    function unplug(from: string, to: string) {
      const id = connectionID(from, to);
      if (!(id in subscriptions)) {
        throw new Error(`Cannot disconnect ${from} -> ${to}`);
      }

      self.connections.splice(
        self.connections.findIndex(
          (connection) => connection.from.id === from && connection.to.id === to
        ),
        1
      );
      subscriptions[id].unsubscribe();
      delete subscriptions[id];
    }

    function registerInput(portConfig: Instance<typeof PortConfig>) {
      if (self.inputs.has(portConfig.id)) {
        throw new Error(
          `Cannot re-register existing input port ${portConfig.id}`
        );
      }

      self.inputs.set(portConfig.id, portConfig);
      self.toStreams.set(portConfig.id, new Subject<unknown>());
    }

    function unregisterInput(toPort: string) {
      if (!self.inputs.has(toPort)) {
        throw new Error(`Cannot unregister non-existent input port ${toPort}`);
      }

      self.inputs.delete(toPort);
      self
        .connectionsTo(toPort)
        .forEach((fromPort) => unplug(fromPort.id, toPort));
      self.toStreams.delete(toPort);
    }

    function registerOutput(portConfig: Instance<typeof PortConfig>) {
      if (self.outputs.has(portConfig.id)) {
        throw new Error(
          `Cannot re-register existing output port ${portConfig.id}`
        );
      }

      self.outputs.set(portConfig.id, portConfig);
      self.fromStreams.set(portConfig.id, new Subject<unknown>());
    }

    function unregisterOutput(fromPort: string) {
      if (!self.outputs.has(fromPort)) {
        throw new Error(`Cannot re-register existing output port ${fromPort}`);
      }

      self.outputs.delete(fromPort);
      self
        .connectionsFrom(fromPort)
        .forEach((toPort) => unplug(fromPort, toPort.id));
      self.fromStreams.delete(fromPort);
    }

    return {
      plug,
      unplug,
      registerInput,
      unregisterInput,
      registerOutput,
      unregisterOutput,
    };
  });
