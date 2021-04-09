import { Injectable } from '@angular/core';
import { PortInfo, OpenOptions } from 'serialport';
import { ElectronService } from '../electron/electron.service';
import { SerialPortWatcher } from './serial-port-watcher';

@Injectable({
  providedIn: 'root'
})
export class SerialPortService {
  
  listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void;

  constructor(private electronService: ElectronService) { }

  async serialPortList(): Promise<PortInfo[]> {
    const promise = new Promise<PortInfo[]>((resolve, reject) => {
      this.electronService.ipcRenderer.once('listing', (event, ports: PortInfo[]) => {
        resolve(ports);
      });
      this.electronService.ipcRenderer.send('listing');
    });
    return promise;
  }

  connect(path: string, options: OpenOptions, watcher: SerialPortWatcher): Promise<Error | null> {
    console.log("connecting... ", path);
    return new Promise<Error | null>((resolve, reject) => {
      this.electronService.ipcRenderer.once('port', (event, msg, ...args: any[]) => {
        switch(msg) {
          case 'open': {
            this.register();
            resolve(null);
            break;
          }
          case 'error': {
            reject(args[0]);
            break;
          }
          default:
            console.assert('unreachable case detected')
        }
      });
      this.electronService.ipcRenderer.send('port', 'connect', path, options);
    });
  }

  register() {
    this.listener = (event: Electron.IpcRendererEvent, ...args: any[]) => {
      const msg = args[0] as string;
      switch(msg) {
        case 'open':
          console.assert('invalid state');
          break;
        case 'error':

      }
    };
    this.electronService.ipcRenderer.on('port', this.listener)

  };

}
