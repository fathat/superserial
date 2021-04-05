import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnChanges, OnInit, AfterViewInit, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PortInfo } from "serialport";
import { ElectronService } from '../../../core/services';
import { SerialPortService } from '../../../core/services/serial-port/serial-port.service';
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";

@Component({
  selector: 'ss-port-list',
  templateUrl: './port-list.component.html',
  styleUrls: ['./port-list.component.scss'],
  providers: [ ElectronService, SerialPortService ]
})
export class PortListComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource([] as PortInfo[]);
  portInfo: PortInfo[];

  _hideEmpty = true;
  get hideEmpty(): boolean {
    return this._hideEmpty;
  }
  set hideEmpty(on: boolean) {
    this._hideEmpty = on;
    this.onRefresh();
  }

  displayedColumns = ['path', 'manufacturer', 'pnpId', 'vendorId', 'productId', 'serialNumber'];
  baudRates = [
    9600,
    19200,
    38400,
    57600,
    74880,
    115200,
    230400,
    250000,
    500000,
    1000000,
    2000000
  ];

  constructor(
    private serialPortService: SerialPortService,
    private router: Router) { }

  ngOnInit(): void {
    this.updatePortList();
  }

  ngOnDestroy(): void {

  }

  getHideEmpty(): boolean {
    return this.hideEmpty;
  }

  updatePortList(): void {
    this.serialPortService.serialPortList().then(
      (ports) => {
        this.portInfo = ports.filter(x => this.getHideEmpty() ?  typeof x.manufacturer !== 'undefined' : true);
        this.dataSource.data = this.portInfo;
      }
    );
  }

  onClick(path: string, baud: number): void {
    this.router.navigateByUrl(`/watch?path=${path}&baud=${baud}`);
    console.log(path);
    console.log(baud);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onRefresh(): void {
    console.log("hide empty", this.hideEmpty);
    this.updatePortList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur  = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

}
