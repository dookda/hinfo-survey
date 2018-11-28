
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { ReportProvider } from '../providers/report/report';
import { HttpClientModule } from '@angular/common/http';
import { HomePage } from '../pages/home/home';
import { LayerPageModule } from '../pages/layer/layer.module';
import { AddDataPageModule } from '../pages/add-data/add-data.module';
import { DetailPageModule } from '../pages/detail/detail.module';
import { ListPageModule } from '../pages/list/list.module';



@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    LayerPageModule,
    AddDataPageModule,
    DetailPageModule,
    ListPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ReportProvider
  ]
})
export class AppModule { }
