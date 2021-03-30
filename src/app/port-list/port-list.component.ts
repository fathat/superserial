import { Component, OnChanges, OnInit, AfterViewInit, SimpleChanges } from '@angular/core';
import { PortInfo } from "serialport";
import { ElectronService } from '../core/services';
import { SerialPortService } from '../core/services/serial-port/serial-port.service';

@Component({
  selector: 'app-port-list',
  templateUrl: './port-list.component.html',
  styleUrls: ['./port-list.component.scss'],
  providers: [ ElectronService, SerialPortService ]
})
export class PortListComponent implements OnInit, OnChanges, AfterViewInit {

  subHeader = "Sup"; 
  portInfo: PortInfo[]= [];

  constructor(
    private electronService: ElectronService,
    private serialPortService: SerialPortService) { }

  ngOnInit(): void {
    this.updatePortList();
  }

  updatePortList() {
    this.serialPortService.serialPortList().then(
      (ports) => this.portInfo = ports.filter(x => x.vendorId));
  }
  
  ngAfterViewInit() {
    
  }

  onRefresh() {
    this.updatePortList();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur  = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

}
