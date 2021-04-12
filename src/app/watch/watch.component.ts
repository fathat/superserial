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
import {ConnectionState, HexEntry, LineEntry, LineType} from "../data-model";
import {WatchListComponent} from "../shared/components/watch-list/watch-list.component";
import {watch} from "fs";

const watchDirective = new RegExp(/@w\s+(\S+)\s+(.*)\s*/);

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit, SerialPortWatcher, OnDestroy {

  path = "";
  baudRate = 9600;
  baudRates = baudRates;
  state: ConnectionState = 'disconnected';

  hexData: HexEntry[] = [];
  pauseHexData: HexEntry[] = [];

  stringData: LineEntry[] = [];
  pauseStringData: LineEntry[] = [];

  paused = false;

  @ViewChild('stringView') private stringViewElement: ElementRef;

  @ViewChild("baudRateSelect") baudRateSelect: MatSelect;

  @ViewChild("varWatch") watchListComponent: WatchListComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serialPortService: SerialPortService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  addData(data: number[]): void {
    if(this.paused) {
      this.pauseHexData.push({data, timestamp: new Date()});
    } else {
      this.hexData.push({data, timestamp: new Date()});
    }
  }

  writeViewString(line: string, type: LineType = undefined): void {
    while(this.stringData.length > 100) {
      this.stringData.pop();
    }
    this.stringData.push({line, timestamp: new Date(), type});
    this.changeDetectorRef.detectChanges();
  }

  onSerialTextLine(line: string): void {
    if(line.startsWith('@w') && !this.paused) {
      const match = watchDirective.exec(line);
      this.watchListComponent.updateWatch(match[1], match[2]);
      return;
    }

    if(this.paused) {
      this.pauseStringData.push({line, timestamp: new Date()});
    } else {
      this.writeViewString(line);
    }
  }

  onSerialData(data: number[]): void {
    this.addData(data);
  }

  onSerialError(err: Error): void {
    console.error("data", err);
    this.writeViewString(`# Error! ${err.message}`, 'error');
    this.state = 'disconnected';
    this.changeDetectorRef.detectChanges();

    // hack - our scroll to bottom code sucks
    setTimeout(() => this.scrollToBottom(), 500);
  }

  onSerialClose(): void {
    this.writeViewString(`# Serial port closed.`, 'control');
    this.state = 'disconnected';
    this.serialPortService.unregister();
    this.changeDetectorRef.detectChanges();

    // hack - our scroll to bottom code sucks
    setTimeout(() => this.scrollToBottom(), 500);
  }

  ngOnDestroy(): void {
    this.serialPortService.unregister();
  }

  ngOnInit(): void {
    this.path = this.route.snapshot.queryParams['path'];
    this.baudRate = +this.route.snapshot.queryParams['baud'];
  }

  public scrollToBottom(): string {
    if (this.paused) {
      return '';
    }

    if(!this.stringViewElement || !this.stringViewElement.nativeElement) {
      return;
    }

    try {
      this.stringViewElement.nativeElement.scrollTop = this.stringViewElement.nativeElement.scrollHeight;
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
      this.writeViewString('# Serial port open.', 'control');
      this.changeDetectorRef.detectChanges();

      // hack - our scroll to bottom code sucks
      setTimeout(() => this.scrollToBottom(), 500);
    }).catch((error: Error) => {
      console.error(error);
      this.writeViewString(error.message);
      this.state = 'disconnected';
      this.changeDetectorRef.detectChanges();

      // hack - our scroll to bottom code sucks
      setTimeout(() => this.scrollToBottom(), 500);
    });
  }

  onCloseBtn(): void {
    console.log('closing...');
    this.serialPortService.beginClose();
  }

  onPause(): void {
    this.paused = true;
    this.changeDetectorRef.detectChanges();
  }

  onPlay(): void {
    this.paused = false;
    this.stringData.push(...this.pauseStringData);
    this.pauseStringData = [];
  }

  compareBaudRates(o1: number | string, o2: number | string): boolean {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${o1}` === `${o2}`;
  }

  async onHome(): Promise<boolean> {
    return this.router.navigate(['/']);
  }

}
