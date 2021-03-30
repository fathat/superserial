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
      this.electronService.ipcRenderer.on('render-update-serial-ports', (event, ports: PortInfo[]) => {
        console.log('port list received');
        resolve(ports);
      });
    });
    this.electronService.ipcRenderer.send('list-serial-ports');
    return promise;
  }
}
