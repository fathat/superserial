export interface SerialPortWatcher {
  onSerialData(data: number[]);
  onSerialError(err: Error);
  onSerialClose();
}
