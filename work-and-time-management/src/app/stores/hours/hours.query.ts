import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { HoursState, HoursStore } from './hours.store';
import { map, switchMap, tap } from 'rxjs/operators';
import { Hours } from './hours.model';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class HoursQuery extends QueryEntity<HoursState> {

    hours$ = this.selectAll();

    constructor(
        protected store: HoursStore
    ) {
        super(store);
    }

    selectHoursForWorksite(worksiteId: string): Observable<number> {
        return this.selectAll({
            filterBy: [
                el => el.worksiteId === worksiteId
            ]
        }).pipe(
            map((hours: Hours[]) => hours.map(el => el.marked)),
            map(hoursArr => {
                return hoursArr.reduce((a, b) => a + b, 0);
            }),
        );
    }

    selectHoursForDay(millis: number, activeWorksiteId: string) {
        const dayMillis1 = new Date(millis);
        return this.selectAll({
            filterBy: [
                el => {
                    return moment(el.createdAt).isSame(dayMillis1, 'day') && el.worksiteId === activeWorksiteId;
                }
            ]
        });
    }

    selectHoursForAnyDay(day: moment.Moment): Observable<number> {
        return this.selectAll().pipe(
            map(el => {
                return el.filter(elx => moment(elx.updatedAt).isSame(day, 'day'));
            }),
            map(res => res.map(el => el.marked)),
            map(hoursArr => {
                return hoursArr.reduce((a, b) => a + b, 0);
            }),
        );
    }

    getHourWorktype(hourId: string) {
        const hoursById = this.getAll().filter(el => el.id === hourId);
        if (hoursById) {
            const element = hoursById[0];
            return element.worktypeId;
        }
    }

    selectActiveHours() {
        return this.selectActiveId()
            .pipe(
                switchMap(id => id ? this.selectEntity(id) : of(null))
            );
    }

    selectAllHoursByWorksiteAndUser(userId: string, worksiteId: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.userId === userId,
                entity => entity.worksiteId === worksiteId
            ]
        });
    }

    selectAllHoursByWorktypeAndUser(userId: string, worktypeId: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.userId === userId,
                entity => entity.worktypeId === worktypeId
            ]
        });
    }

    selectTotalHoursByUser(userId: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.userId === userId
            ]
        }).pipe(
            map(hours => {
                return hours.map(el => el.marked);
            }),
            map(hoursArr => {
                return hoursArr.reduce((acc, val) => acc + val, 0);
            }),
            map(hours => hours > 0 ? hours : 0),
        );
    }

    selectHoursForCurrentMonth(userId: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.userId === userId
            ]
        }).pipe(
            map(hours => {
                return hours.map(el => {
                    return {
                        hours: el.marked,
                        createdAt: el.createdAt,
                        updatedAt: el.updatedAt
                    };
                });
            }),
            map(hours => {
                const newHours =
                    hours.map((el: { hours: number, updatedAt: string, createdAt: string }) => {
                        return {
                            hours: el.hours,
                            currentMonth: new Date().getMonth(),
                            dateCreatedAt: new Date(el.createdAt).getMonth(),
                            dateUpdatedAt: new Date(el.updatedAt).getMonth()
                        };
                    });
                return newHours.filter(el => {
                    if (
                        el.currentMonth === el.dateCreatedAt ||
                        el.currentMonth === el.dateUpdatedAt
                    ) {
                        return el;
                    }
                });
            }),
            map(hours => {
                if (hours && hours.length > 0) {
                    const mapped = hours.map(el => el.hours);
                    if (mapped.length > 0) {
                        return mapped.reduce((acc, val) => acc + val, 0);
                    }
                }
            }),
        );
    }
}
