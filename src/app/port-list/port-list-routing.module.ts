import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PortListComponent } from './port-list.component';

const routes: Routes = [
  {
    path: 'port-list',
    component: PortListComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortListRoutingModule { }
