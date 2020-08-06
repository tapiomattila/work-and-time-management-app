import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { WorksitesQuery, Worksite } from '../worksites/state';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-manage-worksites',
    templateUrl: './manage-worksites.component.html',
    styleUrls: ['./manage-worksites.component.scss']
})
export class ManageWorksitesComponent implements OnInit {

    worksites$: Observable<Worksite[]>;

    constructor(
        private router: Router,
        private worksitesQuery: WorksitesQuery
    ) { }

    ngOnInit() {
        this.worksites$ = this.worksitesQuery.selectAll();
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    edit(worksite: Worksite, index: number) {
        console.log('show worksite on edit', worksite);
        console.log('index: ', index);
    }

    addNew() {
        console.log('add new');
    }
}
