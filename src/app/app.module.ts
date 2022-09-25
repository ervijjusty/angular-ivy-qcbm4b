import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MenuItemService } from './ds-menu/menu-item.service';
import { DsMenuComponent } from './ds-menu/ds-menu.component';
import { DsMenuListItemComponent } from './ds-menu/ds-menu-list-item/ds-menu-list-item.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [BrowserModule, FormsModule, CommonModule, RouterModule.forRoot([])],
  declarations: [
    AppComponent,
    HelloComponent,
    DsMenuComponent,
    DsMenuListItemComponent,
  ],
  bootstrap: [AppComponent],
  providers: [MenuItemService],
})
export class AppModule {}
