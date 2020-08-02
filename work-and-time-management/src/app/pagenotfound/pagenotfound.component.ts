import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from '../enumerations/global.enums';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  locationDash() {
    this.router.navigate([RouterRoutesEnum.DASHBOARD]);
  }

}
