import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController, Platform, Modal } from 'ionic-angular';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import { ReportProvider } from '../../providers/report/report';
import { AddDataPage } from '../add-data/add-data';
import { LayerPage } from '../layer/layer';
import { ListPage } from '../list/list';
import { ContactPage } from '../contact/contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public map: L.map;
  public marker: L.marker;
  public pos: number[];
  private lat: number = 0;
  private lon: number = 0;

  //lyrGroup
  private lyrGroup: any;

  //lyrs
  private tam: any;
  private roads: any;
  private hybrid: any;
  private terrain: any;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private reportProvider: ReportProvider,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {

  }

  ionViewDidLoad() {
    this.loadMap();
    // this.showLocation();
  }

  loadMap() {
    this.map = L.map('map', {
      center: [16.716543, 100.239446],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    })

    // h = roads only; m = standard roadmap; p = terrain; r = somehow altered roadmap; s = satellite only; t = terrain only; y = hybrid;

    this.roads = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.terrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    // overlay
    this.tam = L.tileLayer.wms('http://cgi.uru.ac.th/geoserver/hinfo/ows?', {
      layers: 'hinfo:watprik',
      format: 'image/png',
      transparent: true,
      // CQL_FILTER: 'prov_code=63',
      zIndex: 3
    });

    this.lyrGroup = {
      lyr: [
        { name: 'ขอบเขตตำบล', lyr: 'ud_tam', wms: this.tam.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'แผนที่ถนน', lyr: 'roads', wms: this.roads.addTo(this.map), type: 'base', 'isChecked': true },
        { name: 'แผนที่ผสม', lyr: 'hybrid', wms: this.hybrid, type: 'base', 'isChecked': false },
        { name: 'แผนที่ภูมิประเทศ', lyr: 'terrain', wms: this.terrain, type: 'base', 'isChecked': false },
      ]
    }
    // L.control.layers(baseLayers, overlay, { position: 'topright' }).addTo(this.map);
  }

  showLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      showBackdrop: false
    });
    loading.present();

    const myIcon = L.icon({
      iconUrl: 'assets/icon/map-marker.png',
      iconSize: [32, 32],
      iconAnchor: [22, 34],
      popupAnchor: [-3, -26]
    });

    this.platform.ready().then(() => {

      // this.geolocation.getCurrentPosition({ enableHighAccuracy: false }).then((res) => {
      //   this.pos = [res.coords.latitude, res.coords.longitude];
      //   this.lat = res.coords.latitude;
      //   this.lon = res.coords.longitude;

      //   this.removeMarker();
      //   this.reportProvider.setLocation(this.lat, this.lon);
      //   this.map.setView(this.pos, 16);
      //   this.marker = L.marker(this.pos, {
      //     icon: myIcon,
      //     draggable: true,
      //     iconName: 'myPoint'
      //   }).addTo(this.map);

      //   loading.dismiss();
      //   this.marker.on('dragend', function (e) {
      //     this.pos = [e.target._latlng.lat, e.target._latlng.lng];
      //   });
      // }).catch((error) => {
      //   console.log('Error getting location', error);
      // });

      let watch = this.geolocation.watchPosition();
      watch.subscribe((res) => {
        this.pos = [res.coords.latitude, res.coords.longitude];
        this.lat = res.coords.latitude;
        this.lon = res.coords.longitude;

        this.removeMarker();
        this.reportProvider.setLocation(this.lat, this.lon);
        this.map.setView(this.pos, 16);
        this.marker = L.marker(this.pos, {
          icon: myIcon,
          draggable: true,
          iconName: 'myPoint'
        }).addTo(this.map);

        loading.dismiss();
        this.marker.on('dragend', function (e) {
          this.pos = [e.target._latlng.lat, e.target._latlng.lng];
          console.log(this.pos);
        });
      });
    })
  }

  gotoReport() {
    if (this.lat === 0 || this.lon === 0) {
      const alert = this.alertCtrl.create({
        title: 'ไม่พบข้อมูลตำแหน่ง',
        subTitle: 'เปิดการใช้งาน location และกดค้นหาตำแหน่งก่อน',
        buttons: ['ตกลง']
      })
      alert.present()

    } else {
      const modal: Modal = this.modalCtrl.create(AddDataPage, { pos: this.pos });
      modal.present();
    }
  }

  gotoList() {
    this.navCtrl.push(ListPage)
  }

  gotoContact() {
    this.navCtrl.push(ContactPage)
  }

  selectLayers() {
    const modal: Modal = this.modalCtrl.create(LayerPage, this.lyrGroup);
    modal.present();
    modal.onDidDismiss((res) => {
      this.lyrGroup.lyr = res;
      this.lyrFn(res)
    });
  }

  lyrFn(lyrs: any) {
    for (let i of lyrs) {
      if (i.isChecked) {
        this.map.addLayer(i.wms);
      } else {
        this.map.removeLayer(i.wms);
      }
    }
  }

  refreshPage() {
    window.location.reload();
  }

  removeMarker() {
    this.map.eachLayer((lyr) => {
      // console.log(lyr);
      if (lyr.options.iconName == 'myPoint') {
        this.map.removeLayer(lyr);
      }
    })
  }

}
