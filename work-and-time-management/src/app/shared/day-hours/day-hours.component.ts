import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-day-hours',
    templateUrl: './day-hours.component.html',
    styleUrls: ['./day-hours.component.scss'],
})
export class DayHoursComponent implements OnInit {

    activeDay = false;
    day: any;

    @Input()
    set days(val: Date) {
        const dayToISO = val.toISOString();
        const dayMomentStr = moment(dayToISO);
        const dayFormat = dayMomentStr.format('LLLL');
        this.day = dayFormat.substring(0, 3);

        const current = moment();
        const isSame = current.isSame(dayMomentStr, 'day');

        if (isSame) {
            this.activeDay = true;
        }

    }

    @Input() hours: string;

    constructor() { }

    ngOnInit() {
    }
}
