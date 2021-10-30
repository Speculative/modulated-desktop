import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { portStore, IPortConfig } from "./plugs";
import * as _ from "lodash";

export function useInputPort(portConfig: IPortConfig) {
  const portConfigMemo = useMemo(() => portConfig, []);
  if (!_.isEqual(portConfig, portConfigMemo)) {
    throw new Error(
      `Port config should never change between useInputPort invocations`
    );
  }

  useEffect(() => {
    portStore.registerInput(portConfig);

    return () => {
      portStore.unregisterInput(portConfig.id);
    };
  });
}

export function useOutputPort(portConfig: IPortConfig) {
  const portConfigMemo = useMemo(() => portConfig, []);
  if (!_.isEqual(portConfig, portConfigMemo)) {
    throw new Error(
      `Port config should never change between useOutputPort invocations`
    );
  }

  useEffect(() => {
    portStore.registerOutput(portConfig);

    return () => {
      portStore.unregisterOutput(portConfig.id);
    };
  });
}
