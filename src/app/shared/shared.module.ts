import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { PortListComponent } from './components/port-list/port-list.component';
import { PlotlyExampleComponent } from './components/plotly-example/plotly-example.component';
import { PlotlyComponent, PlotlyModule } from 'angular-plotly.js';
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, PortListComponent, PlotlyExampleComponent],
  imports: [CommonModule, TranslateModule, FormsModule, PlotlyModule, MatTableModule, MatSortModule, MatMenuModule, MatButtonModule, MatCheckboxModule],
  exports: [TranslateModule, MatCheckboxModule, MatButtonModule, MatMenuModule, MatSortModule, WebviewDirective, FormsModule, PortListComponent, PlotlyComponent, PlotlyExampleComponent]
})
export class SharedModule {}
