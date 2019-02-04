import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportProvider {

  private url: string = 'http://localhost:3000/hinfo';
  private pos: any;

  constructor(
    public http: HttpClient
  ) {
  }

  createUser(data: any) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/createuser', data).subscribe((res: any) => {
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  }

  login(usr: any) {
    return new Promise((resolve, reject) => {
      console.log(usr);
      this.http.post(this.url + '/login', usr)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        });
    });
  }

  getReportList() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/select').subscribe((res: any) => {
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  }

  postMobileReport(data: any) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/insert', data).subscribe((res: any) => {
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  }

  setLocation(lat: number, lon: number) {
    this.pos = {
      lat: lat,
      lon: lon
    }
  }

  getLocation() {
    return this.pos
  }


}
