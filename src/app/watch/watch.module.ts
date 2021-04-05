import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from './watch-routing.module';
import { WatchComponent } from './watch.component';
import { SharedModule } from '../shared/shared.module';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";


@NgModule({
  declarations: [WatchComponent],
  imports: [
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    SharedModule,
    WatchRoutingModule
  ]
})
export class WatchModule { }
