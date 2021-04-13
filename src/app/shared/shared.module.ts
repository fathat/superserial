import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {PageNotFoundComponent} from './components/';
import {WebviewDirective} from './directives/';
import {FormsModule} from '@angular/forms';
import {PortListComponent} from './components/port-list/port-list.component';
import {PlotlyComponent, PlotlyModule} from 'angular-plotly.js';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { WatchListComponent } from './components/watch-list/watch-list.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VarGraphComponent } from './components/var-graph/var-graph.component';
import {NgApexchartsModule} from "ng-apexcharts";

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, PortListComponent, WatchListComponent, VarGraphComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    PlotlyModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTabsModule,
    NgApexchartsModule
  ],
  exports: [
    TranslateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule,
    WebviewDirective,
    FormsModule,
    PortListComponent,
    PlotlyComponent,
    WatchListComponent,
    VarGraphComponent
  ]
})
export class SharedModule {
}
