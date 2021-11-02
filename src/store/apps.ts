import { types, Instance } from "mobx-state-tree";
import { toJS } from "mobx";
import { Ports } from "./ports";
import { PortSpec } from "./portSpec";

const Window = types.model("Window", {
  x: types.number,
  y: types.number,
  w: types.number,
  h: types.number,
});

const AppInstance = types.model("AppInstance", {
  id: types.identifier,
  portSpec: types.frozen<PortSpec>({ inputs: {}, outputs: {} }),
});

function inputPortName(namespace: string, portName: string) {
  return `${namespace}::in::${portName}`;
}

function outputPortName(namespace: string, portName: string) {
  return `${namespace}::out::${portName}`;
}

const Windows = types
  .model("Windows", {
    windows: types.map(Window),
    windowOrder: types.array(types.reference(AppInstance)),
  })
  .views((self) => {
    function window(namespace: string) {
      const windowConfig = self.windows.get(namespace);
      if (!windowConfig) {
        throw new Error(
          `Cannot fetch window details for non-existent window ${namespace}.`
        );
      }

      return {
        ...windowConfig,
        z: self.windowOrder.findIndex((w) => w.id === namespace),
      };
    }
    return { window };
  })
  .actions((self) => {
    function move(windowId: string, [x, y]: [number, number]) {
      const existingWindow = self.windows.get(windowId);
      if (!existingWindow) {
        throw new Error(`Cannot move non-existent window ${windowId}.`);
      }

      self.windows.set(windowId, { ...existingWindow, x, y });
    }

    function focus(windowId: string) {
      const existingWindowIndex = self.windowOrder.findIndex(
        (w) => w.id === windowId
      );
      if (existingWindowIndex === -1) {
        throw new Error(`Cannot focus non-existent window ${windowId}.`);
      }

      self.windowOrder.splice(existingWindowIndex, 1);
      self.windowOrder.push(windowId);
    }

    function open(windowId: string, rect: Instance<typeof Window>) {
      self.windows.set(windowId, rect);
      self.windowOrder.push(windowId);
    }

    function close(windowId: string) {
      self.windows.delete(windowId);
      self.windowOrder.splice(
        self.windowOrder.findIndex((w) => w.id === windowId),
        1
      );
    }

    return { move, focus, open, close };
  });

const Apps = types
  .model("Apps", {
    ports: Ports,
    instances: types.map(AppInstance),
    windows: Windows,
  })
  .views((self) => {
    function inputPortStreams(namespace: string) {
      const portSpec = self.instances.get(namespace)?.portSpec;
      if (!portSpec) {
        throw new Error(
          `Cannot fetch input ports for unregistered app ${namespace}.`
        );
      }

      return Object.fromEntries(
        Object.keys(portSpec.inputs)
          .map((portName) => inputPortName(namespace, portName))
          .map((portId) => [portId, self.ports.toStreams.get(portId)!])
      );
    }

    return { inputPortStreams };
  })
  .actions((self) => {
    function registerAppInstance(namespace: string, portSpec: PortSpec) {
      Object.entries(portSpec.inputs).forEach(([portName, portType]) => {
        self.ports.registerInput({
          id: inputPortName(namespace, portName),
          type: portType,
        });
      });

      self.windows.open(namespace, { x: 100, y: 100, w: 400, h: 300 });
      self.instances.set(namespace, {
        id: namespace,
        portSpec,
      });
    }

    function unregisterAppInstance(namespace: string) {
      const instance = self.instances.get(namespace);
      if (!instance) {
        throw new Error(`Cannot unregister non-existent app ${namespace}`);
      }

      Object.keys(instance.portSpec.inputs).forEach((portName) => {
        self.ports.unregisterInput(inputPortName(namespace, portName));
      });

      self.windows.close(namespace);
    }

    return { registerAppInstance, unregisterAppInstance };
  });

export const appStore = Apps.create({
  ports: {
    inputs: {},
    outputs: {},
  },
  instances: {},
  windows: {},
});
