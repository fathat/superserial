import {
  AfterContentChecked,
  AfterViewChecked, AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from "@angular/router";
import { baudRates } from '../constants';
import { SerialPortWatcher } from '../core/services/serial-port/serial-port-watcher';
import { SerialPortService } from '../core/services/serial-port/serial-port.service';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'closing';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit, AfterContentChecked, SerialPortWatcher, OnDestroy {

  path = "";
  baudRate = 9600;
  baudRates = baudRates;
  state: ConnectionState = 'disconnected';

  stringData = "";
  pauseData: number[] = [];
  paused = false;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @ViewChild("baudRateSelect") baudRateSelect: MatSelect;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serialPortService: SerialPortService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  addData(data: number[]): void {
    if(this.paused) {
      this.pauseData.push(...data);
    } else {
      this.writeViewStringData(data);
    }
  }

  writeViewStringData(data: number[]): void {
    const str = new TextDecoder().decode(Uint8Array.from(data));
    this.stringData += str;
    this.changeDetectorRef.detectChanges();
  }

  onSerialData(data: number[]): void {
    this.addData(data);
  }

  onSerialError(err: Error): void {
    console.error("data", err);
    this.stringData += `\r\n\r\n#Error! ${err.message}`;
    this.state = 'disconnected';
    this.changeDetectorRef.detectChanges();
  }

  onSerialClose(): void {
    this.stringData += `\r\n\r\n# Serial port closed.`;
    this.state = 'disconnected';
    this.serialPortService.unregister();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.serialPortService.unregister();
  }

  ngOnInit(): void {
    this.path = this.route.snapshot.queryParams['path'];
    this.baudRate = +this.route.snapshot.queryParams['baud'];
  }

  ngAfterContentChecked(): void {
    this.scrollToBottom();
  }

  public scrollToBottom(): string {
    if (this.paused) {
      return '';
    }
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('scrollToBottom', err);
    }

    return '';
  }

  onOpenBtn(): void {
    this.paused = false;
    this.state = 'connecting';
    this.serialPortService.beginOpen(this.path, {
      autoOpen: true,
      baudRate: this.baudRate
    }, this).then(() => {
      this.state = 'connected';
      if(this.stringData.length > 0) {
        this.stringData += `\n\n Serial port open.`;
      } else {
        this.stringData = 'Serial port open.\n';
      }
      this.changeDetectorRef.detectChanges();
    }).catch((error: Error) => {
      console.error(error);
      if(this.stringData.length > 0) {
        this.stringData += error.message + '\n';
      } else {
        this.stringData += `\n` + error.message + '\n';
      }

      this.state = 'disconnected';
      this.changeDetectorRef.detectChanges();
    });
  }

  onCloseBtn(): void {
    console.log('closing...');
    this.serialPortService.beginClose();
  }

  onPause(): void {
    this.paused = true;
  }

  onPlay(): void {
    this.paused = false;
    this.writeViewStringData(this.pauseData);
    this.pauseData = [];
  }

  compareBaudRates(o1: number | string, o2: number | string): boolean {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${o1}` === `${o2}`;
  }

  async onHome(): Promise<boolean> {
    return this.router.navigate(['/']);
  }

}
