import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger, translateXRightTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-current-worksite-card',
  templateUrl: './current-worksite-card.component.html',
  styleUrls: ['./current-worksite-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
    translateXRightTrigger
  ]
})
export class CurrentWorksiteCardComponent implements OnInit {

  showIcon = false;
  moved = 'default';

  @Input()
  set icon(value: any) {
    this.showIcon = value.active;
    value.active ? this.moved = 'moved' : this.moved = 'default';
  }

  constructor() { }

  ngOnInit() { }
}
