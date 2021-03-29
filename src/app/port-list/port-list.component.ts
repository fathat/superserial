import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-port-list',
  templateUrl: './port-list.component.html',
  styleUrls: ['./port-list.component.scss']
})
export class PortListComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {

    this.electronService.ipcRenderer.send('list-serial-ports');
    this.electronService.ipcRenderer.on('render-update-serial-ports', (event, ...args: any[]) => {
      console.log('port list', args);
    });
  }

}
