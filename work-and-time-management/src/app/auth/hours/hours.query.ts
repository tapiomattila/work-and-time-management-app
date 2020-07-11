import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { HoursState, HoursStore } from './hours.store';
import { map, tap, switchMap } from 'rxjs/operators';
import { Hours } from './hours.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HoursQuery extends QueryEntity<HoursState> {

    private addHoursSelectedDayMillisSubj = new BehaviorSubject<number>(null);
    addHoursSelectedDayMillisObs$ = this.addHoursSelectedDayMillisSubj.asObservable();

    hours$ = this.selectAll();

    constructor(
        protected store: HoursStore,

    ) {
        super(store);
    }

    selectHoursForWorksite(worksiteId: string): Observable<number> {
        return this.selectAll({
            filterBy: [
                el => el.worksiteId === worksiteId
            ]
        }).pipe(
            map((hours: Hours[]) => hours.map(el => el.markedHours)),
            map(hoursArr => {
                return hoursArr.reduce((a, b) => a + b, 0);
            }),
        );
    }

    selectHoursForSelectedDay(worksiteId: string): Observable<number> {
        let selectedDay;
        let hoursArr;
        return this.selectAll({
            filterBy: [
                el => el.worksiteId === worksiteId
            ]
        }).pipe(
            tap((hours: Hours[]) => {
                hoursArr = hours;
            }),
            switchMap(() => {
                return this.addHoursSelectedDayMillisObs$;
            }),
            map(selDayMillis => {
                const dayMillis1 = new Date(selDayMillis);
                const dayMillisDate = dayMillis1.getDate();
                const dayMillistMonth = dayMillis1.getMonth() + 1;
                const dayMillisYear = dayMillis1.getFullYear();

                selectedDay = {
                    day: dayMillisDate,
                    month: dayMillistMonth,
                    year: dayMillisYear
                };

                const filteredHours = hoursArr.filter(el => {
                    const lastUpdated = new Date(el.updatedAt);
                    const date = lastUpdated.getDate();
                    const month = lastUpdated.getMonth() + 1;
                    const year = lastUpdated.getFullYear();
                    const testDate = date === selectedDay.day && month === selectedDay.month && year === selectedDay.year;
                    if (testDate) {
                        return el;
                    }
                });

                return filteredHours;
            }),
            map((hours: Hours[]) => hours.map(el => el.markedHours)),
            map(arr => {
                return arr.reduce((a, b) => a + b, 0);
            }),

        );
    }

    selectWorksiteHours(worksiteId: string) {
        return this.hours$.pipe(
            map(res => {
                if (res) {
                    return res.filter(el => {
                        if (el.worksiteId === worksiteId) {
                            return el;
                        }
                    });
                }
            })
        );
    }

    setAddHoursDateSelection(selection: number) {
        this.addHoursSelectedDayMillisSubj.next(selection);
    }

}
