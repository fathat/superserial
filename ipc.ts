import { BrowserWindow } from "electron";
import * as SerialPort from "serialport";
import { PortMessages } from "./src/app/constants";
import Readline = SerialPort.parsers.Readline;

export const listingHandler = (event, ...args: any[]) => {
  SerialPort.list().then((portInfo: SerialPort.PortInfo[]) => {
    event.reply('listing', portInfo);
  }).catch(reason => {
    console.error("Listing failed", reason);
  });
};

export const makePortHandler = (win: BrowserWindow) => {
  let activeSerialPort: SerialPort | null = null;
  
  return (event, msg: PortMessages, ...args: any[]) => {
    switch (msg) {
      case 'open': {
        const [path, options]: [string, SerialPort.OpenOptions] = args as any;

        if (activeSerialPort) {
          if (activeSerialPort.isOpen) {
            activeSerialPort.close((err) => {
              if (err) {
                event.reply('port', 'error', err);
              } else {
                event.reply('port', 'close');
              }
            });
          }
          activeSerialPort = null;
        }

        console.log("opening port...", path, options);
        activeSerialPort = new SerialPort(path, options, (error) => {
          if (error) {
            event.reply('port', 'error', error);
          } else {
            event.reply('port', 'open');

            activeSerialPort.on('data', (data) => {
              //console.log('activeSerialPort - data', data);
              win.webContents.send('port-data', Array.from(data.values()));
            });

            const parser = new Readline({ delimiter: '\r\n' });
            activeSerialPort.pipe(parser);
            parser.on('data', (buffer: Buffer) => {
              win.webContents.send('port-text-line', buffer.toString('utf-8'));
            });

            activeSerialPort.on('close', () => {
              console.log('activeSerialPort - close');
              win.webContents.send('port', 'close');
            });

            activeSerialPort.on('error', (err) => {
              console.log('activeSerialPort - error', err);
              win.webContents.send('port', 'error', err);
            });
          }
        });

        break;
      }
      case 'close':
        activeSerialPort.close(() => {
          win.webContents.send('port', 'close');
        });
        break;
      case 'send':
        activeSerialPort.write(args[0], (error: Error, bytesWritten: number) => {
          if (error) {
            win.webContents.send('port', 'error', error);
          } else {
            win.webContents.send('port', 'datasent', bytesWritten);
          }
        })
        break;
    }
  };
}