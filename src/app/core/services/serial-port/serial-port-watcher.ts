export interface SerialPortWatcher {
    onSerialData(data: string);
    onSerialError(err: Error);
    onSerialClose();
}