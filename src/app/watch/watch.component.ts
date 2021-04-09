import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import {ActivatedRoute, Router} from "@angular/router";
import { baudRates } from '../constants';
import { SerialPortWatcher } from '../core/services/serial-port/serial-port-watcher';
import { SerialPortService } from '../core/services/serial-port/serial-port.service';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit, SerialPortWatcher {

  path = "";
  baudRate = 9600;
  baudRates = baudRates;
  state: ConnectionState = 'disconnected';

  @ViewChild("baudRateSelect") baudRateSelect: MatSelect;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serialPortService: SerialPortService
  ) { }

  onSerialData(data: string) {
    throw new Error('Method not implemented.');
  }
  onSerialError(err: Error) {
    throw new Error('Method not implemented.');
  }
  onSerialClose() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.path = this.route.snapshot.queryParams['path'];
    this.baudRate = +this.route.snapshot.queryParams['baud'];
  }

  onConnect(): void {
    this.state = 'connecting';
    this.serialPortService.connect(this.path, {
      autoOpen: true,
      baudRate: this.baudRate
    }, this).then(() => {
      this.state = 'connected';
    }).catch((error) => {
      console.error(error)
      this.state = 'disconnected';
    });
  }

  compareBaudRates(o1: any, o2: any): boolean {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${o1}` === `${o2}`;
  }

  async onHome(): Promise<boolean> {
    return this.router.navigate(['/']);
  }

}
