import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger, fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-day-hours',
  templateUrl: './day-hours.component.html',
  styleUrls: ['./day-hours.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
    fadeInEnterTrigger
  ]
})
export class DayHoursComponent implements OnInit {

  @Input() day: string;
  @Input() hour: number;

  constructor() { }

  ngOnInit() {
  }

}
