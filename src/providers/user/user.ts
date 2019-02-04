import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class UserProvider {

  private url: string = 'http://cgi.uru.ac.th/service';
  private local: string = 'http://localhost:3000/hinfo';

  constructor(
    public http: HttpClient,
  ) {
    console.log('Hello UserProvider Provider');
  }

  createusr(usr: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.local + '/', usr).subscribe((res) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }

  register(fname: string, username: string, password: string, email: string, mobile: string) {
    return new Promise((resolve, reject) => {
      const data = {
        fname: fname,
        uname: username,
        upass: password,
        uemail: email,
        umobile: mobile
      }
      this.http.post(this.url + '/wc_register.php', data)
        .subscribe((res) => {
          resolve(res);
        }, err => {
          reject(err);
        })
    })
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let data = {
        uname: username,
        upass: password,
      };
      this.http.post(this.url + '/wc_login.php', data)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        });
    });
  }
}
