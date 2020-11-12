import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    // Admin settings
    // -> Hours
    // All hours by worksites
    // All hours by worktypes
    // Hours by user
    // Hours by user in current month
    // Hours by user and worktypes
    // Hours by user and worksites
  }

  ngOnDestroy() {
  }
}
