import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { HomePage } from '../home/home';
// import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { ReportProvider } from '../../providers/report/report';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public username: string;
  public password: string;

  private uname: string;
  private utoken: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private reportProvider: ReportProvider
  ) {
  }
  ionViewDidLoad() {
    this.checkLogin();
  }

  doLogin() {
    let loader = this.loadingCtrl.create({ spinner: 'dots', content: 'Logging...' });
    const usr = {
      uname: this.username,
      upass: this.password
    }
    loader.present();
    this.reportProvider.login(usr)
      .then((res: any) => {
        loader.dismiss();
        if (res.data.length == 1) {
          this.storage.set('utoken', res.data[0].id);
          this.storage.set('fname', res.data[0].name);
          this.storage.set('uname', this.username);
          this.navCtrl.setRoot(HomePage);
        }
      }, (error) => {
        loader.dismiss();
        console.log('Could not login to server!', error);
      });
  }

  async checkLogin() {
    await this.storage.get('uname')
      .then((res) => {
        this.uname = res;
      });
    await this.storage.get('utoken')
      .then((res) => {
        this.utoken = res;
      });

    console.log(this.uname, this.utoken)

    if (this.uname && this.utoken) {
      console.log('already login');
      this.navCtrl.setRoot(HomePage);
    }
  }

  doRegister() {
    this.navCtrl.push(RegisterPage)
  }

}
