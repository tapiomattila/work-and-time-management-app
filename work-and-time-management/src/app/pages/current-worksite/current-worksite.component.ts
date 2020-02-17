import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/worksites/state/worksites.model';
import { WorksitesQuery } from 'src/app/worksites/state/worksites.query';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-current-worksite',
    templateUrl: 'current-worksite.component.html',
    styleUrls: ['current-worksite.component.scss'],
    animations: [
        fadeInEnterTrigger
    ]
})
export class CurrentWorksiteComponent implements OnInit {
    currentWorkSite$: Observable<Worksite>;

    constructor(
        private router: Router,
        public windowService: WindowService,
        private worksiteQuery: WorksitesQuery
    ) { }

    ngOnInit() {
        this.currentWorkSite$ = this.worksiteQuery.selectRecentlyUpdateWorksite()
            .pipe(
                map((worksites: Worksite[]) => {
                    return worksites[0];
                })
            )

    }

    locationBack() {
        this.router.navigate(['/dashboard']);
    }
}