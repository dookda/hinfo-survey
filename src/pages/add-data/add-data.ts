import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ReportProvider } from '../../providers/report/report';

@IonicPage()
@Component({
  selector: 'page-add-data',
  templateUrl: 'add-data.html',
})
export class AddDataPage {
  public pos: any;
  public lat: number;
  public lon: number;
  public usrData: any;
  public yymmdd: any;
  public ddmmyy: any;

  public reportForm: FormGroup;
  public fplace: FormControl;
  public fdesc: FormControl;
  public ftype: FormControl;
  public imageData: any;
  public imageFile: any;

  public stockKey: string;

  constructor(
    public fb: FormBuilder,
    private camera: Camera,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public view: ViewController,
    public http: HttpClient,
    private storage: Storage,
    public reportProvider: ReportProvider,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController
  ) {
    //this.pos = navParams.get('pos');
    this.fplace = fb.control('', Validators.required);
    this.ftype = fb.control('', Validators.required);
    this.fdesc = fb.control('');
    // this.usrData = this.service.getUserData();
    //this.fname = fb.control('', Validators.required);
    this.reportForm = fb.group({
      'pname': this.fplace,
      'ptype': this.ftype,
      'pdesc': this.fdesc,
      //'fname': this.fname
    });
    this.pos = this.reportProvider.getLocation()
    this.lat = this.pos.lat
    this.lon = this.pos.lon
    console.log(this.pos)
  }

  ionViewDidLoad() {
    this.getStorage();
    let today = new Date();
    this.yymmdd = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    this.ddmmyy = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  }

  getStorage() {
    this.storage.length().then(res => {
      this.stockKey = "data" + (res + 1);
    });
  }

  takePicture() {
    const camOpt: CameraOptions = {
      quality: 50,
      allowEdit: true,
      targetHeight: 400,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(camOpt).then((imageData) => {
      let base64Image = 'data:image/png;base64,' + imageData;
      this.imageFile = base64Image;
    }, (err) => {
      console.log(err);
    });
  }

  browsePicture() {
    // let options: CameraOptions = {
    //   destinationType: 0,
    //   sourceType: 0,
    //   allowEdit: true
    // };

    let options: CameraOptions = {
      quality: 50,
      allowEdit: true,
      targetHeight: 400,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/png;base64,' + imageData;
      this.imageFile = base64Image;
    }, (error) => {
      console.log('Browse picture error!', error);
    });

    console.log('browsePicture ParkingAddPage');
  }

  storeData() {
    let data = {
      'key': this.stockKey,
      'lat': this.lat,
      'lon': this.lon,
      'pname': this.reportForm.controls['pname'].value,
      'pdesc': this.reportForm.controls['pdesc'].value,
      'ptype': this.reportForm.controls['ptype'].value,
      'photo': this.imageFile,
      'yymmdd': this.yymmdd,
      'ddmmyy': this.ddmmyy,
      'imgfile': this.imageFile
    };

    this.storage.set(this.stockKey, data).then(
      (res) => {
        this.resetForm();
        this.getStorage();
      },
      (error) => {
        console.error('Error storing item', error)
      }
    );
  }

  sendData() {
    let toast = this.toastCtrl.create({
      message: 'เพิ่มข้อมูลสำเร็จ',
      duration: 3000,
      position: 'bottom',
    });

    toast.onDidDismiss(() => {
      this.viewCtrl.dismiss({
        status: "send success"
      });
    });

    // let loader = this.loadingCtrl.create({ content: "กำลังบันทึกข้อมูล.." });
    let data;
    if (this.imageFile == undefined) {
      data = {
        'lat': this.lat,
        'lon': this.lon,
        'pname': this.reportForm.controls['pname'].value,
        'pdesc': this.reportForm.controls['pdesc'].value,
        'ptype': this.reportForm.controls['ptype'].value,
        'photo': '',
        'pdate': this.yymmdd,
        'img': this.imageFile
      };
    } else {
      data = {
        'lat': this.lat,
        'lon': this.lon,
        'pname': this.reportForm.controls['pname'].value,
        'pdesc': this.reportForm.controls['pdesc'].value,
        'ptype': this.reportForm.controls['ptype'].value,
        'photo': this.imageFile,
        'pdate': this.yymmdd,
        'img': this.imageFile
      };
    }

    this.reportProvider.postMobileReport(data).then((res) => {
      toast.present();
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  }

  removePicture() {
    this.imageFile = null;
    console.log('removePicture ParkingAddPage');
  }

  resetForm() {
    this.reportForm.reset();
    this.imageFile = '';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
