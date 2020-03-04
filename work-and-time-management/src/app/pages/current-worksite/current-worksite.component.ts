import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/worksites/state/worksites.model';
import { WorksitesQuery } from 'src/app/worksites/state/worksites.query';

@Component({
    selector: 'app-current-worksite',
    templateUrl: 'current-worksite.component.html',
    styleUrls: ['current-worksite.component.scss']
})
export class CurrentWorksiteComponent implements OnInit {

    worksite$: Observable<Worksite>;
    date: Date;

    constructor(
        private router: Router,
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

    locationBack() {
        this.router.navigate(['/dashboard']);
    }
}