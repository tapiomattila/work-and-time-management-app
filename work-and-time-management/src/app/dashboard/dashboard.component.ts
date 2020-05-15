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

  days = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];
  date: string;

  constructor(
    public navigationHandlerService: NavigationHandlerService,
    public cardService: CardService,
    public windowService: WindowService
  ) { }

  ngOnInit() {
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    this.date = `${day}.${month}.${year}`;
  }
}
