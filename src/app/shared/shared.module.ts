import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { PortListComponent } from './components/port-list/port-list.component';
import { PlotlyExampleComponent } from './components/plotly-example/plotly-example.component';
import { PlotlyComponent, PlotlyModule } from 'angular-plotly.js';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, PortListComponent, PlotlyExampleComponent],
  imports: [CommonModule, TranslateModule, FormsModule, PlotlyModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, PortListComponent, PlotlyComponent, PlotlyExampleComponent]
})
export class SharedModule {}
