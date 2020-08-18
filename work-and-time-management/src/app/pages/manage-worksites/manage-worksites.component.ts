import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-manage-worksites',
    templateUrl: './manage-worksites.component.html',
    styleUrls: ['./manage-worksites.component.scss']
})
export class ManageWorksitesComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];

    private modalSubj = new BehaviorSubject<boolean>(false);
    modalObs$ = this.modalSubj.asObservable();

    worksites$: Observable<Worksite[]>;
    showModal$: Observable<boolean>;
    worksiteForm: FormGroup;

    constructor(
        private router: Router,
        private worksitesQuery: WorksitesQuery,
        private route: ActivatedRoute,
        private worksiteService: WorksitesService
    ) { }

    ngOnInit() {
        this.worksites$ = this.worksitesQuery.selectAll();
        this.initForm();
        this.routeParams();
        this.routeEvents();
        this.modalControl();
    }

    initForm() {
        this.worksiteForm = new FormGroup({
            name: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            postalcode: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
        });
    }

    routeParams() {
        const routeSubs = this.route.params.subscribe((res: Params) => {
            if (!res.id) {
                console.warn('No route params id');
                return;
            }

            this.modalSubj.next(true);
            const worksite = this.worksitesQuery.getEntity(res.id);

            if (!worksite) {
                console.log('FETCH BY ID');
                const fetchByIdSubs = this.worksiteService.fetchWorksiteById(res.id).subscribe(res2 => {

                    if (!res2 || !res2.data) {
                        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
                        return;
                    }

                    const mapped = res2.data as Worksite;
                    console.log('show worksite 2', mapped);
                    this.populateForm(mapped);

                });
                this.subscriptions.push(fetchByIdSubs);
                return;
            }

            console.log('show worksite 1', worksite);
            this.populateForm(worksite);
        });
        this.subscriptions.push(routeSubs);
    }

    routeEvents() {
        const routerEventSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (event.url.includes(`/${RouterRoutesEnum.EDIT_WORKSITE}`)) {
                    this.modalSubj.next(true);
                }

                if (event.url === `/${RouterRoutesEnum.ADD_WORKSITE}`) {
                    this.modalSubj.next(true);
                }
            }
        });
        this.subscriptions.push(routerEventSubs);
    }

    modalControl() {
        const modalSubs = this.modalObs$.subscribe(res => {
            if (!res) {
                const url = this.route.snapshot.url;
                if (url) {

                    url.forEach(el => {
                        if (el && el.path === 'add') {
                            this.modalSubj.next(true);
                        }
                    });
                }
            }
        });
        this.subscriptions.push(modalSubs);
    }

    populateForm(worksite: Worksite) {
        this.worksiteForm.controls.name.setValue(worksite.nickname);
        this.worksiteForm.controls.address.setValue(worksite.streetAddress);
        this.worksiteForm.controls.postalcode.setValue(worksite.postalCode);
        this.worksiteForm.controls.city.setValue(worksite.city);
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    edit(worksite: Worksite, index: number) {
        this.router.navigate([`${RouterRoutesEnum.EDIT_WORKSITE}/${worksite.id}`]);
    }

    addNew() {
        this.router.navigate([RouterRoutesEnum.ADD_WORKSITE]);
    }

    submit() {
        const formValues = this.worksiteForm.value;
        console.log('show form', formValues);
    }

    closeModal() {
        this.modalSubj.next(false);
        this.router.navigate([`${RouterRoutesEnum.MANAGE_WORKSITES}`]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }
}
