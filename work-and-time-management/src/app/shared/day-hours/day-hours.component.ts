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
    indexX: number;
    widthX: number;

    @Input()
    set index(value: number) {
        this.indexX = value;
    }

    @Input()
    set hoursVal(val: [{ day: moment.Moment }, boolean]) {
        if (val) {
            const iso = val ? val[0].day.toISOString() : null;
            const mom = val[0].day as moment.Moment;
            const format = mom.format('LLLL');
            this.day = format.substring(0, 3);

            if (val[1] && this.indexX < 5) {
                this.hours = val;
                this.hours$ = this.hoursQuery.selectHoursForAnyDay(val[0].day);
            }

            if (!val[1]) {
                this.hours = val;
                this.hours$ = this.hoursQuery.selectHoursForAnyDay(val[0].day);
            }

            if (iso) {
                const current = moment();
                const isSame = current.isSame(iso, 'day');

                if (isSame) {
                    console.log('show active day', iso);
                    this.activeDay = true;
                }
            }
        }
    }

    constructor(
        private hoursQuery: HoursQuery
    ) { }

    ngOnInit() { }
}
