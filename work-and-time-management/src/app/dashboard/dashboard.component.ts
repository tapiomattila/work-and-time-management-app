import { Component, OnInit } from '@angular/core';
import { WindowService } from '../services/window.service';
import { CardService } from '../services/card.service';
import { NavigationHandlerService } from '../services/navigation-handler.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * MOBILE
   */

  constructor(
    public navigationHandlerService: NavigationHandlerService,
    public cardService: CardService,
    public windowService: WindowService
  ) { }

  ngOnInit() {
  }
}
