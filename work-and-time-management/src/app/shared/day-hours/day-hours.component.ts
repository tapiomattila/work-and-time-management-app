import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { HoursQuery } from 'src/app/auth/hours';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-day-hours',
    templateUrl: './day-hours.component.html',
    styleUrls: ['./day-hours.component.scss'],
})
export class DayHoursComponent implements OnInit {
    activeDay = false;
    day: string;
    hours: object;
    hours$: Observable<number>;

    @Input()
    set hoursVal(val: { day: moment.Moment }) {
        if (val) {
            console.log('show val', val);
            this.hours = val;

            const mom = val.day as moment.Moment;
            const format = mom.format('LLLL');
            this.day = format.substring(0, 3);

            this.hours$ = this.hoursQuery.selectHoursForAnyDay(val.day);
        }
    }


    constructor(
        private hoursQuery: HoursQuery
    ) { }

    ngOnInit() { }
}
