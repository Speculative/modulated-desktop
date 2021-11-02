import { useEffect, useState, useMemo } from "react";
import { PortSpec, zeroes, TypeOfPort } from "./portSpec";
import { appStore } from "./apps";
import * as _ from "lodash";

type PortHook<TPortSpec extends PortSpec> = {
  inputs: {
    [portName in keyof TPortSpec["inputs"]]: {
      id: string;
      value: TypeOfPort<TPortSpec["inputs"][portName]>;
    };
  };
  outputs: {
    [portName in keyof TPortSpec["inputs"]]: {
      id: string;
      emit: (value: TypeOfPort<TPortSpec["inputs"][portName]>) => void;
    };
  };
};

export function usePorts<TPortSpec extends PortSpec>(
  namespace: string,
  portSpec: TPortSpec
): PortHook<TPortSpec> {
  const portConfigMemo = useMemo(() => portSpec, []);
  if (!_.isEqual(portSpec, portConfigMemo)) {
    throw new Error(
      `Port config should never change between useInputPort invocations`
    );
  }

  const inputPortStates = Object.fromEntries(
    Object.entries(portSpec.inputs).map(([portName, portType]) => [
      portName,
      useState(zeroes[portType]),
    ])
  );

  useEffect(() => {
    // portStore.registerInput(portConfig);
    appStore.registerAppInstance(namespace, portSpec);

    Object.entries(appStore.inputPortStreams(namespace)).forEach(
      ([portName, stream$]) => stream$.subscribe(inputPortStates[portName][1])
    );

    return () => {
      // portStore.unregisterAppInstance(namespace);
    };
  });

  return {
    inputs: Object.fromEntries(
      Object.entries(inputPortStates).map(([portName, [portState]]) => [
        portName,
        portState,
      ])
    ),
  };
}
