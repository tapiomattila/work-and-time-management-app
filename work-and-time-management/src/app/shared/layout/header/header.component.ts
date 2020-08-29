import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() momentDay: moment.Moment;

  openMenuModal = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  backArrowPressed() {
    this.router.navigate([RouterRoutesEnum.DASHBOARD]);
  }

  openMenu() {
    this.openMenuModal = true;
  }

  closedModal($event) {
    this.openMenuModal = false;
  }

}
