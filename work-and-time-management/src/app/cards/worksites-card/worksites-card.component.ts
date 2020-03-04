import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-worksites-card',
  templateUrl: './worksites-card.component.html',
  styleUrls: ['./worksites-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger
  ]
})
export class WorksitesCardComponent implements OnInit {

  @Input() class: string;
  constructor() { }

  ngOnInit() {
  }

}
