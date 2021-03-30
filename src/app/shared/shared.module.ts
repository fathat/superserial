import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { PortListComponent } from './components/port-list/port-list.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, PortListComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, PortListComponent]
})
export class SharedModule {}
