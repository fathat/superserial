import { ChangeDetectorRef } from '@angular/core';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

export interface VariableSnapshot {
  value: string | number;
  isNumeric: boolean;
  timestamp: Date;
}

export interface WatchVar {
  name: string;
  snapshots: VariableSnapshot[];
}

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'name',
    'value',
    'lastUpdated'
  ];

  watches: WatchVar[] = [];
  dataSource = new MatTableDataSource(this.watches);

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  private static numericValueOrString(value: string): [string | number, boolean] {
    if(isNaN(+value)) {
      return [value, false];
    } else {
      return [+value, true];
    }
  }

  public updateWatch(name: string, rawValue: string): void {
    const [value, isNumeric] = WatchListComponent.numericValueOrString(rawValue);
    let watch = this.watches.find(x => x.name === name);

    const snapshot = {isNumeric, value, timestamp: new Date()};
    if(!watch) {
      watch = {name, snapshots: [snapshot]};
      this.watches.push(watch);
    } else {
      watch.snapshots.push(snapshot);
    }

    this.dataSource.data = this.watches;
    this.changeDetectorRef.detectChanges();
  }
}
