import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { WorksitesQuery } from 'src/app/worksites/state/worksites.query';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/worksites/state/worksites.model';
import { fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
    selector: 'app-add-hours',
    templateUrl: 'add-hours.component.html',
    styleUrls: ['add-hours.component.scss'],
    animations: [
        fadeInEnterTrigger
    ]
})
export class AddHoursComponent implements OnInit {

    worksite$: Observable<Worksite>;

    date: Date;

    constructor(
        private route: ActivatedRoute,
        private worksiteQuery: WorksitesQuery
    ) { }

    ngOnInit() {
        this.date = new Date();
        this.route.params.subscribe((params: Params) => {
            console.log('show params', params);
            this.worksite$ = this.worksiteQuery.selectEntity(params.worksiteid);
        });
    }
}
