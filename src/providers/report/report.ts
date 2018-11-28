import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportProvider {

  private url: string = 'http://cgi.uru.ac.th:3000/api';
  private pos: any;

  constructor(
    public http: HttpClient
  ) {
  }

  getReportList() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/hinfoSelect').subscribe((res: any) => {
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  }

  postMobileReport(data: any) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/hinfoInsert', data).subscribe((res: any) => {
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
