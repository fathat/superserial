import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchComponent } from './watch.component';

const routes: Routes = [
  {
    path: 'watch',
    component: WatchComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WatchRoutingModule { }
