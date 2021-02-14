import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { WorksitesQuery } from '../../stores/worksites/state';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
// import { HoursQuery, TableHours } from 'src/app/auth/hours';
import { map, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { fadeInEnterTrigger } from 'src/app/animations/animations';
import { HoursQuery } from 'src/app/stores/hours';

@Component({
    selector: 'app-added-hours',
    templateUrl: './added-hours.component.html',
    styleUrls: ['./added-hours.component.scss'],
    animations: [
        fadeInEnterTrigger
    ]
})
export class AddedHoursComponent implements OnInit, AfterViewInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    displayedColumns: string[] = ['updateAt', 'worksiteName', 'worktypeName', 'hoursFormatted'];
    dataSource;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private worksiteQuery: WorksitesQuery,
        private router: Router,
        private hoursQuery: HoursQuery
    ) { }

    ngOnInit() {
        // const data$ = this.hoursQuery.selectAll().pipe(
        //     map(elements => {
        //         return this.worksiteQuery.selectTableHours(elements);
        //     }),
        //     tap(res => {
        //         const result = (res as any) as TableHours[];
        //         const sortedByDates = this.sortData(result);
        //         this.dataSource = new MatTableDataSource(sortedByDates);
        //     }),
        // ).subscribe();

        // this.subscriptions.push(data$);
    }

    // sortData(data: TableHours[]) {
    //     return data.sort((a, b) => {
    //         return new Date(b.updatedAt) as any - (new Date(a.updatedAt) as any);
    //     });
    // }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.dataSource.sort = this.sort;
        //     this.dataSource.paginator = this.paginator;
        // }, 1000);
    }

    // formatHours(hours: number) {
    //     const frac = hours % 1;

    //     if (frac === 0) {
    //         return `${hours.toString()}h`;
    //     }

    //     const full = hours - frac;
    //     return `${full}h ${frac * 60}min`;
    // }

    // backArrowPressed() {
    //     this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    // }

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }
}
