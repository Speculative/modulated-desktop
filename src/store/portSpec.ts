export type PortSpec = {
  inputs: { [portName: string]: PortType };
  outputs: { [portName: string]: PortType };
};

export enum PortType {
  Number = "Number",
}

export const zeroes: { [type in keyof typeof PortType]: unknown } = {
  [PortType.Number]: 0,
};

export type TypeOfPort<TPortType extends PortType> =
  TPortType extends PortType.Number ? number : never;
