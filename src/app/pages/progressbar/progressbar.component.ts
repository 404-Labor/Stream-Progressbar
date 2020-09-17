import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppService, Response } from '../../app.service';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {

  @ViewChild("progressBackground") elementView: ElementRef;

  public value = 0;
  public finish = 0;
  public unit = 'Wörter';
  public percent = Number((100 / this.finish * this.value).toFixed(2));
  public uuid = (localStorage.getItem('uuid')) ? localStorage.getItem('uuid') : undefined;

  constructor(
    private API: AppService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    if (!this.percent) {
      this.percent = 0;
    }

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.uuid = id;
    }

    if (!this.uuid) {
      this.uuid = this.API.create_UUID();
      localStorage.setItem('uuid', this.uuid);
    }

    this.getVal();

    setInterval(() => {
      this.getVal();
    }, 10000);
  }

  getVal() {
    this.API.get('&uid=' + this.uuid).subscribe((val: Response) => {
      if (val.data.length > 0) {
        this.percent = 0;
        this.value = 0;

        this.finish = val.data[0].finish;
        this.unit = val.data[0].unit;

        val.data.forEach(element => {
          this.value = this.value + Number(element.value);
        });

        this.percent = 100 / this.finish * this.value;
        this.percent = Number(this.percent.toFixed(2));
      }
    });
  }

}
