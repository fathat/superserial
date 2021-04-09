
export interface IpcConnectData {
  baudRate?: 115200|57600|38400|19200|9600|4800|2400|1800|1200|600|300|200|150|134|110|75|50|number;
  dataBits?: 8|7|6|5;
  highWaterMark?: number;
  lock?: boolean;
  stopBits?: 1|2;
  parity?: 'none'|'even'|'mark'|'odd'|'space';
}

export interface IpcSerialData {
  data: string;
}
