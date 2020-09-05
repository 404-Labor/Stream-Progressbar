import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@NgModule()
export class AppService {

  constructor(private http: HttpClient) { }

  get(body: any) {
    return this.http.get(environment.url + 'get' + body);
  }

  post(body: any) {
    return this.http.get(environment.url + 'post' + body);
  }

  update(body: any) {
    return this.http.get(environment.url + 'update' + body);
  }

  delete(body: any) {
    return this.http.get(environment.url + 'delete' + body);
  }

  new(body: any) {
    return this.http.get(environment.url + 'new' + body);
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, (c) => {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
}

export interface Response {
  data: any[];
  status: number;
  status_message: string;
}
