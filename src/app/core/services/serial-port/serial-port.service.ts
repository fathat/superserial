import { Injectable } from '@angular/core';
import { PortInfo, OpenOptions } from 'serialport';
import { ElectronService } from '../electron/electron.service';
import { SerialPortWatcher } from './serial-port-watcher';
import {PortMessages} from "../../../constants";

@Injectable({
  providedIn: 'root'
})
export class SerialPortService {

  openListener: (event: Electron.IpcRendererEvent, ...args: any[]) => void;
  listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void;
  watcher: SerialPortWatcher;

  constructor(private electronService: ElectronService) { }

  async serialPortList(): Promise<PortInfo[]> {
    return new Promise<PortInfo[]>((resolve, reject) => {
      this.electronService.ipcRenderer.once('listing', (event, ports: PortInfo[]) => {
        resolve(ports);
      });
      this.electronService.ipcRenderer.send('listing');
    });
  }

  beginOpen(path: string, options: OpenOptions, watcher: SerialPortWatcher): Promise<Error | null> {
    console.log("connecting... ", path, options);
    this.electronService.ipcRenderer.removeAllListeners('port');
    this.watcher = watcher;
    return new Promise<Error | null>((resolve, reject) => {
      this.openListener = (event, msg, ...args: any[]) => {
        switch(msg) {
          case 'open': {
            console.log('open!');
            this.electronService.ipcRenderer.removeListener('port', this.openListener);
            this.register();
            resolve(null);
            break;
          }
          case 'error': {
            this.electronService.ipcRenderer.removeListener('port', this.openListener);
            reject(args[0]);
            break;
          }
          default:
            console.assert('unreachable case detected');
        }
      };
      this.electronService.ipcRenderer.on('port', this.openListener);
      this.electronService.ipcRenderer.send('port', 'open', path, options);
    });
  }

  beginClose(): void {
    this.electronService.ipcRenderer.send('port', 'close');
  }

  register(): void {
    this.listener = (event: Electron.IpcRendererEvent, ...args: any[]) => {
      const msg = args[0] as PortMessages;
      console.log(args);
      switch(msg) {
        case 'open': {
          console.assert('invalid state');
          break;
        }
        case 'data': {
          this.watcher.onSerialData(args[1]);
          break;
        }
        case 'error': {
          this.watcher.onSerialError(args[1]);
          break;
        }
        case 'close': {
          this.watcher.onSerialClose();
          break;
        }
      }
    };
    this.electronService.ipcRenderer.on('port', this.listener);
  }

  unregister(): void {
    this.electronService.ipcRenderer.removeAllListeners('port');
  }

}
