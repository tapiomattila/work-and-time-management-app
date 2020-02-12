import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  animations: [
    fadeInEnterTrigger
]
})
export class ManageUsersComponent implements OnInit {

  constructor(
    private location: Location,
    public windowService: WindowService
  ) { }

  ngOnInit() {
  }

  locationBack() {
    this.location.back();
  }

}
