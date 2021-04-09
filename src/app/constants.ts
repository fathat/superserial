export type Channels = 'listing' | 'port';

export type PortMessages = 'open' | 'close' | 'error' | 'data' | 'send';

export type Parity = 'none'|'even'|'mark'|'odd'|'space';

export const parityOptions = [ 'none', 'even', 'mark', 'odd', 'space']
export const dataBitOptions = [undefined, 8, 7, 6, 5];
export const stopBitOptions = [undefined, 1, 2];
export const baudRates = [
  9600,
  19200,
  38400,
  57600,
  74880,
  115200,
  230400,
  250000,
  500000,
  1000000,
  2000000
];
