import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import * as moment from 'moment';
import { User } from 'src/app/stores/users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private _user: User;
  private _profileIconUrl = '';
  private _back = false;

  @Input()
  set back(value: boolean) { this._back = value; }
  get back() { return this._back; }

  @Input()
  set user(user: User) {
    this._user = user;
   }
  get user() { return this._user; }

  @Input()
  set icon(value: string) { this._profileIconUrl = value; }
  get icon() { return this._profileIconUrl; }

  @Input() title: string;
  @Input() momentDay: moment.Moment;

  iconUrl = '../../../assets/svg/sprite.svg#icon-user';
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
