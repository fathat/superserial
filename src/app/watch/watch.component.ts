import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import {ActivatedRoute, Router} from "@angular/router";
import { baudRates } from '../constants';
import { SerialPortService } from '../core/services/serial-port/serial-port.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit, AfterViewInit {

  path = "";
  baudRate = 9600;
  baudRates = baudRates;
  connected = false;

  @ViewChild("baudRateSelect") baudRateSelect: MatSelect;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serialPortService: SerialPortService
  ) { }

  ngAfterViewInit(): void {
    this.baudRateSelect.value = `${this.baudRate}`;
  }

  ngOnInit(): void {
    this.path = this.route.snapshot.queryParams['path']
    this.baudRate = this.route.snapshot.queryParams['baud'];

    this.route.queryParams.subscribe(params => {
      this.path = params['path'];
      this.baudRate = params['baud'];
    });

  }

  onIPCSerialPortConnected() {
    this.connected = true;
  };

  onIPCSerialPortDisconnected() {
    this.connected = true;
  };
  
  compareBaudRates(o1: any, o2: any): boolean {
    return `${o1}` === `${o2}`;
  }

  onHome(): void {
    this.router.navigateByUrl('/');
  }

}
