import { Injectable } from '@angular/core';
import { PortInfo } from 'serialport';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class SerialPortService {
  constructor(private electronService: ElectronService) { }

  async serialPortList(): Promise<PortInfo[]> {
    const promise = new Promise<PortInfo[]>((resolve, reject) => {
      this.electronService.ipcRenderer.once('render-update-serial-ports', (event, ports: PortInfo[]) => {
        resolve(ports);
      });
      this.electronService.ipcRenderer.send('list-serial-ports');
    });
    return promise;
  }
}
