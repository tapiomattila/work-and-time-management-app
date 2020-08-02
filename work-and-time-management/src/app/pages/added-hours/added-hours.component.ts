import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { WorksitesQuery } from '../worksites/state';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { HoursQuery } from 'src/app/auth/hours';
import { map, tap } from 'rxjs/operators';
import { WorkTypeQuery } from 'src/app/worktype/state';
import * as moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-added-hours',
    templateUrl: './added-hours.component.html',
    styleUrls: ['./added-hours.component.scss']
})
export class AddedHoursComponent implements OnInit, AfterViewInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    // hours$: Observable<object[]>;
    // hours: object[];

    displayedColumns: string[] = ['updateAt', 'worksiteName', 'worktypeName', 'hoursFormatted'];
    dataSource;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private worksiteQuery: WorksitesQuery,
        private worktypeQuery: WorkTypeQuery,
        private router: Router,
        private hoursQuery: HoursQuery
    ) { }

    ngOnInit() {
        console.log('added hours');

        const data$ = this.hoursQuery.selectAll().pipe(
            map(elements => {
                return elements.map(el => {
                    const worksiteName = this.worksiteQuery.getWorksiteById(el.worksiteId);
                    const worksiteNameFound = worksiteName ? worksiteName[0].nickname : undefined;

                    const worktypeId = this.hoursQuery.getHourWorktype(el.id);
                    const worktype = this.worktypeQuery.getWorktypeById(worktypeId);
                    const worktypeNameFound = worktype ? worktype.viewName : undefined;

                    const formattedDate = moment(el.updatedAt).format('DD.MM.YYYY');
                    const hoursFormatted = this.formatHours(el.markedHours);

                    return {
                        id: el.id,
                        createdAt: el.createdAt,
                        updateAt: el.updatedAt,
                        updateAtFormatted: formattedDate,
                        worksiteId: el.worksiteId,
                        worksiteName: worksiteNameFound,
                        worktypeId,
                        worktypeName: worktypeNameFound,
                        hours: el.markedHours,
                        hoursFormatted
                    };
                });
            }),
            tap(res => {
                const sortedByDates = this.sortData(res);
                this.dataSource = new MatTableDataSource(sortedByDates);
            }),
        ).subscribe();

        this.subscriptions.push(data$);
    }

    sortData(data) {
        return data.sort((a, b) => {
            // tslint:disable-next-line: no-angle-bracket-type-assertion
            return new Date(b.updateAt) as any - <any> new Date(a.updateAt);
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            console.log('apply sorting');
            this.dataSource.sort = this.sort;
        }, 1000);
    }

    formatHours(hours: number) {
        const frac = hours % 1;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        const full = hours - frac;
        return `${full}h ${frac * 60}min`;
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }
}
