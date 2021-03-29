import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortListComponent } from './port-list.component';

import { PortListRoutingModule } from './port-list-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [PortListComponent],
  imports: [CommonModule, SharedModule, PortListRoutingModule]
})
export class PortListModule { }
