import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnChanges, OnInit, AfterViewInit, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PortInfo } from "serialport";
import { ElectronService } from '../../../core/services';
import { SerialPortService } from '../../../core/services/serial-port/serial-port.service';
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { baudRates, dataBitOptions, parityOptions } from '../../../constants';

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

  _filtered = true;
  get filtered(): boolean {
    return this._filtered;
  }
  set filtered(on: boolean) {
    this._filtered = on;
    this.onRefresh();
  }

  displayedColumns = [
    'path',
    'manufacturer',
    'pnpId',
    'vendorId',
    'productId',
    'serialNumber'
  ];

  baudRates = baudRates;
  dataBitOptions = dataBitOptions;
  parityOptions = parityOptions;


  constructor(
    private serialPortService: SerialPortService,
    private router: Router) { }

  ngOnInit(): void {
    this.updatePortList();
  }

  ngOnDestroy(): void {

  }

  getHideEmpty(): boolean {
    return this.filtered;
  }

  updatePortList(): void {
    this.serialPortService.serialPortList().then(
      (ports) => {
        this.portInfo = ports.filter(x => this.getHideEmpty() ?  typeof x.manufacturer !== 'undefined' : true);
        this.dataSource.data = this.portInfo;
      }
    );
  }

  async onClick(path: string, baud: number): Promise<boolean> {
    return this.router.navigateByUrl(`/watch?path=${path}&baud=${baud}`);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onRefresh(): void {
    console.log("hide empty", this.filtered);
    this.updatePortList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      // noinspection JSUnfilteredForInLoop
      const chng = changes[propName];
      const cur  = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);

      // noinspection JSUnfilteredForInLoop
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

}
