import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from '../services/window.service';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * MOBILE
   */

  hideRouterDashBoard = false;

  constructor(
    private router: Router,
    public cardService: CardService,
    public windowService: WindowService
  ) { }

  ngOnInit() {
    this.windowService.windowSizeObs$.subscribe(res => {
      if (res.width >= 768) {
        this.hideRouterDashBoard = true;
      } else {
        this.hideRouterDashBoard = false;
      }
    });
  }

  navigateToCardContent(card: string) {
    this.router.navigate([`/${card}`]);
  }
}
