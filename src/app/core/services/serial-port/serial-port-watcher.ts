export interface SerialPortWatcher {
  onSerialData(data: number[]);
  onSerialTextLine(line: string);
  onSerialError(err: Error);
  onSerialClose();
}
