import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-day-hours',
  templateUrl: './day-hours.component.html',
  styleUrls: ['./day-hours.component.scss']
})
export class DayHoursComponent implements OnInit {

  @Input() day: string;
  @Input() hour: number;

  constructor() { }

  ngOnInit() {
  }

}
