import { Component, OnInit } from '@angular/core';
import { AppService, Response } from '../../app.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  public goal = 2000;
  public goalDisabled = false;
  public unit = '';
  public unitDisabled = false;
  public valueSet = 0;
  public valueSets = [];
  public sum = 0;
  public uuid = (localStorage.getItem('uuid')) ? localStorage.getItem('uuid') : undefined;

  constructor(
    private API: AppService,
  ) { }

  ngOnInit() {

    if (!this.uuid) {
      this.uuid = this.API.create_UUID();
      localStorage.setItem('uuid', this.uuid);
    }

    this.get();
  }

  get() {
    this.API.get('&uid=' + this.uuid).subscribe((val: Response) => {
      if (val.data.length > 0) {
        this.valueSets = [];
        this.sum = 0;

        this.goal = val.data[0].finish;
        this.goalDisabled = true;
        this.unit = val.data[0].unit;
        this.unitDisabled = true;
        for (let i = 0; i < val.data.length; i++) {
          this.valueSets.push({
            id: Number(val.data[i].id),
            uid: val.data[i].uid,
            value: Number(val.data[i].value)
          })
          this.sum = this.sum + Number(val.data[i].value);
        }
      } else {
        this.valueSets = [];
      }
    });
  }

  set() {
    console.log(this.uuid, this.goal, this.valueSet);
    this.API.post('&uid=' + this.uuid + '&finish=' + this.goal.toString() + '&unit=' + this.unit + '&value=' + this.valueSet.toString()).subscribe((val) => {
      console.log(val);
      this.valueSet = 0;
      this.goalDisabled = true;
      this.unitDisabled = true;
      this.get();
    });
  }

  update(id: number, value: number) {
    this.API.update('&id=' + id.toString() + '&value=' + value.toString()).subscribe(() => {
      this.get();
    });
  }

  delete(id: number) {
    this.API.delete('&id=' + id.toString()).subscribe(() => {
      this.get();
    });
    this.get();
  }

  newProgress() {
    this.API.new('&uid=' + this.uuid.toString()).subscribe(() => {
      this.goal = 0;
      this.unit = '';
      this.valueSet = 0;
      this.goalDisabled = false;
      this.unitDisabled = false;
      this.valueSets = [];
      this.get();
    });
  }

  copyId() {
    navigator.clipboard.writeText('http://progressbar.404-labor.de/#/pro/' + this.uuid).then(() => { });
  }

}
