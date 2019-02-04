import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportProvider } from '../../providers/report/report';
import { HttpClient } from '@angular/common/http';
import * as md5 from 'md5';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public fname: string;
  public lname: string;
  public username: string;
  public password: string;
  public email: string;
  public mobile: string;

  public formGroup: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private userProvider: UserProvider,
    private reportProvider: ReportProvider,
    public formBuilder: FormBuilder,
    public http: HttpClient
  ) {
    this.formGroup = this.formBuilder.group({
      fname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      mobile: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
  }

  doRegister() {
    let loader = this.loadingCtrl.create({ spinner: 'dots', content: 'Logging...' });
    loader.present();
    let usr = {
      'firstname': this.fname,
      'uname': this.username,
      'upass': this.password,
      'uemail': this.email,
      'umobile': this.mobile,
      'utoken': md5(this.fname) + md5(this.username) + md5(this.password) + md5(this.email) + md5(this.mobile)
    }

    this.reportProvider.createUser(usr).then((res: any) => {
      loader.dismiss();
      this.navCtrl.setRoot(LoginPage);
    }, (error) => {
      loader.dismiss();
      console.log('Could not login to server!', error);
    })
  }
}

export interface User {
  firstname?: any
  uname?: any,
  upass?: any,
  uemail?: any,
  umobile?: any
}