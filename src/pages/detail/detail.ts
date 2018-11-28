import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as L from 'leaflet';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  public dat: any;
  public map: L.map;
  public marker: L.marker;
  public pos: number[];

  //lyrGroup
  public lyrGroup: any;

  //lyrs
  private roads: any;
  private satellite: any;
  private hybrid: any;
  private terrain: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.dat = this.navParams.get('data')
    // console.log(this.dat)
  }

  ionViewWillEnter() {
    // console.log(this.dat);
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map2', {
      center: [18.00, 100.50],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    })

    this.roads = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.terrain = L.tileLayer('http://{s}.google.com/vt/lyrs=t&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    // overlay


    const myIcon = L.icon({
      iconUrl: 'assets/icon/map-marker.png',
      iconSize: [32, 32], // size of the icon
      iconAnchor: [22, 34], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -26]
    });

    this.pos = [this.dat.lat, this.dat.lon];
    this.map.setView(this.pos, 16);
    this.marker = L.marker(this.pos, { icon: myIcon, draggable: false }).addTo(this.map);

    this.lyrGroup = {
      lyr: [
        { name: 'แผนที่ถนน', lyr: 'roads', wms: this.roads, type: 'base', 'isChecked': false },
        { name: 'แผนที่ภาพดาวเทียม', lyr: 'satellite', wms: this.satellite, type: 'base', 'isChecked': false },
        { name: 'แผนที่ผสม', lyr: 'hybrid', wms: this.hybrid.addTo(this.map), type: 'base', 'isChecked': false },
        { name: 'แผนที่ภูมิประเทศ', lyr: 'terrain', wms: this.terrain, type: 'base', 'isChecked': true },
      ]
    }

    // L.control.layers(baseLayers, overlay, { position: 'topright' }).addTo(this.map);
  }
}
