import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthenGuard } from './core/guard/authen.guard';
import { NonAuthenGuard } from './core/guard/non-authen.guard';
import { NewUserGuard } from './core/guard/new-user.guard';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthenGuard, NewUserGuard, NonAuthenGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
