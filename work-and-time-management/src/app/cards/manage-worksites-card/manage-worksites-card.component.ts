import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-manage-worksites-card',
  templateUrl: './manage-worksites-card.component.html',
  styleUrls: ['./manage-worksites-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger
    
  ]
})
export class ManageWorksitesCardComponent implements OnInit {

  @Input() class: string;
  constructor() { }

  ngOnInit() {
  }

}
