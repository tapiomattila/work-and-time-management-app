import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { Observable, Subscription, BehaviorSubject, timer } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkType, WorkTypeQuery, WorkTypeService } from 'src/app/pages/worktype/state';
import { map, distinctUntilChanged, delay, tap } from 'rxjs/operators';
import { HoursQuery, Hours, HoursService, TableHours } from 'src/app/auth/hours';
import { UserQuery } from 'src/app/auth/user';
import { formatHours } from 'src/app/helpers/helper-functions';
import { fadeInOutTrigger, fadeInEnterTrigger, fadeInSecondaryTrigger } from 'src/app/animations/animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthQuery } from 'src/app/auth/state';

interface FormData {
    date: Date;
    slider: number;
    worksite: Worksite;
    worktype: WorkType;
}

@Component({
    selector: 'app-add-hours',
    templateUrl: './add-hours.component.html',
    styleUrls: ['./add-hours.component.scss'],
    animations: [
        fadeInOutTrigger,
        fadeInEnterTrigger,
        fadeInSecondaryTrigger,
        trigger('hoursAddedState', [
            state('noAddition', style({
            })),
            state('addition', style({
                // color: '#5FC45A',
                transform: 'scale(1.12)'
            })),
            transition('noAddition <=> addition', animate('400ms 100ms ease-in'))
        ])
    ]
})
export class AddHoursComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    setTableIndex;
    showFormData = true;

    slider$: Observable<number>;

    worksite$: Observable<Worksite>;
    worktype$: Observable<WorkType>;

    worksites$: Observable<Worksite[]>;
    worktypes$: Observable<WorkType[]>;

    dayHours$: Observable<string>;
    dayTableHours$: Observable<object[]>;
    activeHours$: Observable<Hours>;

    dataForm: FormGroup;
    momentDay: moment.Moment;

    private hoursAddedMomentSubj = new BehaviorSubject<'reset' | 'added'>('reset');
    hoursAddedMoment$ = this.hoursAddedMomentSubj.asObservable();

    constructor(
        private worksiteQuery: WorksitesQuery,
        private worksiteService: WorksitesService,
        private worktypeQuery: WorkTypeQuery,
        private hoursQuery: HoursQuery,
        private route: ActivatedRoute,
        private userQuery: UserQuery,
        private hoursService: HoursService,
        private worktypeService: WorkTypeService,
        private router: Router,
        private authQuery: AuthQuery
    ) { }

    ngOnInit() {
        this.hoursAddedMomentSubj.next('reset');
        this.worksites$ = this.worksiteQuery.selectAllLiveWorksites();
        this.worktypes$ = this.worktypeQuery.selectAllLiveWorktypes();

        const activeWorktypeSubs = this.worktypes$.subscribe(res => {
            if (res && res.length) {
                this.worktypeService.setActive(res[0].id);
            }
        });

        this.initForm();
        this.momentDay = moment();
        this.worksiteQuery.setAddHoursDateSelection(new Date().getTime());

        this.route.params.subscribe((params: Params) => {
            if (params.id) {
                this.worksiteService.setActive(params.id);
            }
        });

        this.worksite$ = this.worksiteQuery.selectActiveWorksite().pipe(
            tap(active => this.dataForm.controls.worksite.setValue(active)),
        );
        this.worktype$ = this.worktypeQuery.selectActiveWorktype().pipe(
            tap(active => this.dataForm.controls.worktype.setValue(active)),
        );

        this.selectionDayHours();
        this.formValueChanges();
        this.setTableHours(new Date());

        this.slider$ = this.dataForm.controls.slider.valueChanges;
        this.activeHours$ = this.hoursQuery.selectActiveHours();

        this.subscriptions.push(activeWorktypeSubs);
    }

    selectionDayHours() {
        let previousHours = 0;
        this.dayHours$ = this.worksiteQuery.selectHoursForSelectedDay()
            .pipe(
                tap(res => {
                    if (res > 0) {
                        if (res !== previousHours) {
                            this.hoursAddedMomentSubj.next('added');

                            const resetSubs = this.timerX(200, this.resetHours, this)
                                .subscribe(() => resetSubs.unsubscribe());
                        }
                        previousHours = res;
                    }
                }),
                map(el => {
                    return formatHours(el);
                }),
            );
    }

    formValueChanges() {
        this.dataForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                delay(100)
            ).subscribe(data => {
                this.momentDay = moment(data.date);
                if (data.date) {
                    const date = data.date as Date;
                    this.worksiteQuery.setAddHoursDateSelection(date.getTime());
                    this.setTableHours(data.date);
                }
            });
    }

    setTableHours(date: Date) {
        this.dayTableHours$ = this.hoursQuery.selectHoursForDay(date.getTime(), this.worksiteQuery.getActiveId())
            .pipe(
                map(elements => {
                    return this.worksiteQuery.selectTableHours(elements);
                }),
            );
    }

    getItemSelectionFromDropdown(item: Worksite | WorkType) {
        const worksite = this.worksiteQuery.getLiveWorksites().find(el => el.id === item.id);
        const worktype = this.worktypeQuery.getAll().find(el => el.id === item.id);

        if (worksite) {
            const selItem = item as Worksite;
            this.dataForm.controls.worksite.setValue(selItem);
            this.worksiteService.setActive(worksite.id);
            this.resetTableSelection();
        }

        if (worktype) {
            const selItem = item as WorkType;
            this.dataForm.controls.worktype.setValue(selItem);
            this.worktypeService.setActive(worktype.id);
        }
    }

    showFormToggleEmit(event) {
        this.showFormData = event;
    }

    initForm() {
        this.dataForm = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            worksite: new FormControl(null, Validators.required),
            worktype: new FormControl(null, Validators.required),
            slider: new FormControl(null, [Validators.required, this.sliderValidator.bind(this)])
        });
    }

    sliderValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value === 0) {
            return { message: true };
        }
        return null;
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    onSubmit() {
        if (!this.dataForm.valid) {
            return;
        }
        const values = this.dataForm.value as FormData;

        // POST
        if (!this.hoursQuery.getActive()) {
            this.postHours(values);
        }

        // UPDATE
        if (this.hoursQuery.getActive()) {
            this.updateHours(values);
        }
    }

    remove() {
        if (this.hoursQuery.getActive()) {
            const active = this.hoursQuery.getActive() as Hours;
            const id = active.id;
            // REMOVE
            this.hoursService.deleteHours(id).subscribe(() => {
                this.hoursService.removeHours(id);
                this.resetSlider();
                this.resetTableSelection();
            });
        }
    }

    getHoursSelectionFromTable(hours: TableHours | { message: string }) {
        // tslint:disable-next-line: no-string-literal
        const id = hours['id'];

        if (id) {
            const hour = hours as TableHours;
            this.hoursService.setActive(hour.id);
            this.worktypeService.setActive(hour.worktypeId);
            this.worksiteService.setActive(hour.worksiteId);
            this.dataForm.controls.slider.setValue(hour.hours);
        } else {
            this.hoursService.setActive(null);
            this.resetSlider();
            this.resetTableSelection();
        }
    }

    resetSlider() {
        this.dataForm.controls.slider.setValue(0);
    }

    resetWorktype() {
        this.dataForm.controls.worktype.setValue(null);
    }

    resetTableSelection() {
        this.setTableIndex = 1;
        const resetSubs = this.timerX(200, this.resetTableAndHours, this)
            .subscribe(() => resetSubs.unsubscribe());
    }

    postHours(values: FormData) {
        const newHours: Partial<Hours> = {
            userId: this.userQuery.getValue().id,
            createdAt: values.date.toISOString(),
            markedHours: values.slider,
            updatedAt: values.date.toISOString(),
            worksiteId: values.worksite.id,
            worktypeId: values.worktype.id,
            _c: this.authQuery.getValue().clientId
        };
        console.log('POST');
        this.hoursService.postNewHours(newHours).subscribe(() => {
            this.hoursService.setUserHours(this.authQuery.getValue()).subscribe();
            this.resetSlider();
        });
    }

    updateHours(values: FormData) {
        const updatedHours: Partial<Hours> = {
            markedHours: values.slider,
            updatedAt: new Date().toISOString(),
            worksiteId: values.worksite.id,
            worktypeId: values.worktype.id
        };

        console.log('UPDATE', updatedHours);
        const hours = this.hoursQuery.getActive() as Hours;
        this.hoursService.putHours(hours.id, updatedHours).subscribe(() => {

            this.hoursService.updateHours(hours, updatedHours);
            this.getHoursSelectionFromTable({ message: 'reset' });
            this.setTableIndex = 1;
            const resetSubs = this.timerX(200, this.resetTableAndHours, this)
                .subscribe(() => resetSubs.unsubscribe());
        });
    }

    timerX(time: number, cb: (...args) => void, argu: any) {
        const timerObs = timer(time);
        return timerObs.pipe(
            tap(() => {
                cb(argu);
            }),
        );
    }

    resetTableAndHours(thisIn: any) {
        thisIn.setTableIndex = undefined;
        thisIn.hoursService.setActive(null);
    }

    resetHours(thisIn: any) {
        thisIn.hoursAddedMomentSubj.next('reset');
    }

    ngOnDestroy() {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(el => el.unsubscribe());
        }
    }

}
