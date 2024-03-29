import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/core/services/window.service';
import {
    fadeInEnterWithDelayTrigger,
    fadeInEnterTrigger,
} from 'src/app/core/animations/animations';
import { WorksitesQuery } from 'src/app/stores/worksites/state/worksites.query';
import { Observable, of } from 'rxjs';
import { Worksite } from 'src/app/stores/worksites/state/worksites.model';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { RouterRoutesEnum } from 'src/app/core/enums/global.enums';
import { NavigationHandlerService } from 'src/app/core/services/navigation-handler.service';
import { AuthQuery } from 'src/app/core/auth';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-worksites',
    templateUrl: './worksites.component.html',
    styleUrls: ['./worksites.component.scss'],
    animations: [fadeInEnterTrigger],
})
export class WorksitesComponent implements OnInit {
    worksites$: Observable<Worksite[]>;
    momentDay: moment.Moment;

    constructor(
        private location: Location,
        private worksitesQuery: WorksitesQuery,
        private authQuery: AuthQuery,
        private router: Router,
        private navigationHandlerService: NavigationHandlerService,
        public windowService: WindowService
    ) {}

    ngOnInit() {
        this.momentDay = moment();
        this.worksites$ = this.worksitesQuery.selectWorksitesByUserId(
            this.authQuery.getValue().id
        );
    }

    locationBack() {
        this.location.back();
    }

    backArrowPressed(event: any) {
        this.router.navigate([`/${RouterRoutesEnum.DASHBOARD}`]);
    }

    navigate(route: string, id?: string) {
        this.navigationHandlerService.navigateToRoute(route, id);
    }
}
