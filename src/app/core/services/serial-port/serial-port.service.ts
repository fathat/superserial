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

  controlChannelListener: (event: Electron.IpcRendererEvent, msg: string, ...args: any[]) => void;
  dataChannelListener: (event: Electron.IpcRendererEvent, data: number[]) => void;
  textChannelListener: (event: Electron.IpcRendererEvent, line: string) => void;
  watcher: SerialPortWatcher;

  constructor(private electronService: ElectronService) { }

  async serialPortList(): Promise<PortInfo[]> {
    return new Promise<PortInfo[]>((resolve, reject) => {
      this.electronService.ipcRenderer.once('listing', (event, ports: PortInfo[], error: Error | null) => {
        if(error) {
          reject(error);
        } else {
          resolve(ports);
        }
      });
      this.electronService.ipcRenderer.send('listing');
    });
  }
  
  sendString(str: string) {
    this.electronService.ipcRenderer.send('port', 'send', str);
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

    // immediately stop listening for serial port data (in case we're closing because
    // we're being flooded.
    this.electronService.ipcRenderer.removeAllListeners('port-data');
  }

  register(): void {
    this.controlChannelListener = (event: Electron.IpcRendererEvent, msg: PortMessages,  ...args: any[]) => {
      switch(msg) {
        case 'open': {
          console.assert('invalid state');
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

    this.dataChannelListener = (event: Electron.IpcRendererEvent, data: number[]) => {
      this.watcher.onSerialData(data);
    };

    this.textChannelListener = (event: Electron.IpcRendererEvent, text: string) => {
      this.watcher.onSerialTextLine(text);
    };

    this.electronService.ipcRenderer.on('port', this.controlChannelListener);
    this.electronService.ipcRenderer.on('port-data', this.dataChannelListener);
    this.electronService.ipcRenderer.on('port-text-line', this.textChannelListener);
  }

  unregister(): void {
    this.electronService.ipcRenderer.removeAllListeners('port');
    this.electronService.ipcRenderer.removeAllListeners('port-data');
    this.electronService.ipcRenderer.removeAllListeners('port-text-line');
  }

}
