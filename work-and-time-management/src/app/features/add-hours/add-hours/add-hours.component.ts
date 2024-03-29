import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    WorksitesQuery,
    Worksite,
    WorksitesService,
} from '../../../stores/worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/core/enums/global.enums';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
    WorkType,
    WorkTypeQuery,
    WorkTypeService,
} from 'src/app/stores/worktypes/state';
import {
    map,
    distinctUntilChanged,
    delay,
    tap,
    switchMap,
    finalize,
} from 'rxjs/operators';
import { formatHours } from 'src/app/core/helpers/helper-functions';
import {
    fadeInOutTrigger,
    fadeInEnterTrigger,
    fadeInSecondaryTrigger,
    hoursAddedTrigger,
} from 'src/app/core/animations/animations';
import { AuthQuery } from 'src/app/core/auth';
import { DropdownReset } from 'src/app/core/interfaces/helpers';
import {
    Hours,
    HoursQuery,
    HoursService,
    TableHours,
} from 'src/app/stores/hours';
import { UserQuery } from 'src/app/stores/users';

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
        hoursAddedTrigger
    ],
})
export class AddHoursComponent implements OnInit, OnDestroy {
    private hoursAddedMomentSubj = new BehaviorSubject<'reset' | 'added'>(
        'reset'
    );
    hoursAddedMoment$ = this.hoursAddedMomentSubj.asObservable();

    private tableSelectionSubj = new BehaviorSubject<number>(null);
    tableSelectionObs$ = this.tableSelectionSubj.asObservable();

    private subscriptions: Subscription[] = [];
    setTableIndex: number;
    showFormData = true;
    showErrors = false;
    disable = false;

    tableSelection;

    dataForm: FormGroup;
    momentDay: moment.Moment;

    worksite$: Observable<Worksite>;
    worktype$: Observable<WorkType>;

    worksites$: Observable<Worksite[]>;
    worktypes$: Observable<WorkType[]>;

    dayHours$: Observable<string>;
    dayTableHours$: Observable<object[]>;
    activeHours$: Observable<Hours>;

    // date: Date | undefined;
    date: moment.Moment;

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
    ) {}

    ngOnInit() {
        this.initializeComponentData();
        this.route.params.subscribe((params: Params) => {
            if (params.id) {
                this.worksiteService.setActive(params.id);
            }
        });

        this.worksite$ = this.worksiteQuery
            .selectActiveWorksite()
            .pipe(
                tap(active => this.dataForm.controls.worksite.setValue(active))
            );
        this.worktype$ = this.worktypeQuery
            .selectActiveWorktype()
            .pipe(
                tap(active => this.dataForm.controls.worktype.setValue(active))
            );
    }

    initializeComponentData() {
        this.date = moment();
        this.resetHours();
        this.worksites$ = this.worksiteQuery.selectAllLiveWorksites();
        this.worktypes$ = this.worktypeQuery.selectAllLiveWorktypes();
        this.initForm();
        this.momentDay = moment();
        this.worksiteQuery.setAddHoursDateSelection(new Date().getTime());
        this.selectionDayHours();
        this.formValueChanges();

        this.setTableHours(new Date());

        this.activeHours$ = this.hoursQuery.selectActiveHours();

        this.worksiteQuery.selectActiveWorksite().pipe(
            switchMap(worksite => this.hoursQuery.selectWorksiteHoursWithInfo(worksite?.id))
        )
        .subscribe(res => {
            // console.log('show worksite hours', res)
        });
    }

    initForm() {
        this.dataForm = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            worksite: new FormControl(null, Validators.required),
            worktype: new FormControl(null, Validators.required),
            slider: new FormControl(0, [
                Validators.required,
                this.sliderValidator.bind(this),
            ]),
        });
    }

    selectionDayHours() {
        let previousHours = 0;
        this.dayHours$ = this.worksiteQuery.selectHoursForSelectedDay().pipe(
            tap(res => {
                if (res > 0) {
                    if (res !== previousHours) {
                        this.hoursAddedMomentSubj.next('added');
                    }
                    previousHours = res;
                }
            }),
            map(el => {
                return formatHours(el);
            }),
            delay(200),
            tap(() => this.resetHours())
        );
    }

    formValueChanges() {
        this.dataForm.valueChanges
            .pipe(distinctUntilChanged(), delay(100))
            .subscribe(data => {
                this.momentDay = moment(data.date);
                if (data.date) {
                    const date = data.date as Date;
                    this.worksiteQuery.setAddHoursDateSelection(date.getTime());
                    this.setTableHours(data.date);
                    this.date = moment(data.date);
                }
            });
    }

    setTableHours(date: Date) {
        this.dayTableHours$ = this.hoursQuery
            .selectHoursForDay(date.getTime(), this.worksiteQuery.getActiveId())
            .pipe(
                map(elements => {
                    return this.worksiteQuery.selectTableHours(elements);
                })
            );
    }

    getItemSelectionFromDropdown(item: Worksite | WorkType | DropdownReset) {
        this.showErrors = false;
        const isDropdownResetValid = this.dropdownResetHandling(item);
        if (!isDropdownResetValid) {
            return;
        }
        this.setItemSelectionFromDropdown(item);
    }

    dropdownResetHandling(item: Worksite | WorkType | DropdownReset) {
        if (item.id === null) {
            const itemx = item as DropdownReset;
            if (itemx.type === 'worksite') {
                this.dataForm.controls.worksite.setValue(null);
            }
            if (itemx.type === 'worktype') {
                this.dataForm.controls.worktype.setValue(null);
            }
            return false;
        }
        return true;
    }

    setItemSelectionFromDropdown(item: Worksite | WorkType | DropdownReset) {
        const worksite = this.worksiteQuery
            .getLiveWorksites()
            .find(el => el.id === item.id);
        const worktype = this.worktypeQuery
            .getAll()
            .find(el => el.id === item.id);

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

    sliderValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value === 0) {
            return { message: true };
        }
        return null;
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    onValidateAndSubmit() {
        if (!this.dataForm.valid) {
            this.showErrors = true;
            this.validateSlider();
            return;
        }
        this.showErrors = false;
        const values = this.dataForm.value as FormData;

        if (!this.hoursQuery.getActive()) {
            this.postHours(values);
        }

        if (this.hoursQuery.getActive()) {
            this.updateHours(values);
        }
    }

    validateSlider() {
        const slider = this.dataForm.controls.slider.value;
        const isSliderZero = slider === '0';
        if (isSliderZero) {
            this.dataForm.controls.slider.setValue(null);
        }
    }

    remove() {
        if (this.hoursQuery.getActive()) {
            this.showErrors = false;
            const active = this.hoursQuery.getActive() as Hours;
            const id = active.id;
            const removeSubs = this.hoursService
                .deleteHours(id)
                .subscribe(() => {
                    this.hoursService.removeHours(id);
                    this.handleTableSelection({ message: 'reset' });
                });
            this.subscriptions.push(removeSubs);
        }
    }

    handleTableSelection(hours: TableHours | { message: string }) {
        this.tableSelectionSubj.next(null);

        // tslint:disable-next-line: no-string-literal
        const id = hours['id'];

        if (id) {
            const hour = hours as TableHours;
            this.hoursService.setActive(hour.id);
            this.worktypeService.setActive(hour.worktypeId);
            this.worksiteService.setActive(hour.worksiteId);

            this.dataForm.controls.slider.setValue(hour.marked);
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
        this.tableSelectionSubj.next(111);
        this.hoursService.setActive(null);
    }

    postHours(values: FormData) {
        const sliderStr = values.slider.toString();
        const newHours: Partial<Hours> = {
            userId: this.authQuery.getSignedInUser().userId,
            createdAt: values.date.toISOString(),
            updatedAt: values.date.toISOString(),
            createdBy: this.authQuery.getSignedInUser().userId,
            updatedBy: this.authQuery.getSignedInUser().userId,
            marked: parseFloat(sliderStr),
            worksiteId: values.worksite.id,
            worksiteName: values.worksite.name,
            worktypeId: values.worktype.id,
            worktypeName: values.worktype.name,
            clientId: this.authQuery.getValue().clientId,
        };

        this.disable = true;

        const postSubs = this.hoursService
            .postNewHours(newHours)
            .pipe(
                switchMap(() => {
                    this.resetSlider();
                    this.resetTableSelection();
                    return this.hoursService.setUserHours(
                        this.userQuery.getUserById(this.authQuery.getValue().id)
                    );
                }),
                finalize(() => (this.disable = false))
            )
            .subscribe();
        this.subscriptions.push(postSubs);
    }

    updateHours(values: FormData) {
        const sliderStr = values.slider.toString();

        const updatedHours: Partial<Hours> = {
            marked: parseFloat(sliderStr),
            updatedAt: new Date().toISOString(),
            updatedBy: this.authQuery.getSignedInUser().userId,
            worksiteId: values.worksite.id,
            worktypeId: values.worktype.id,
        };

        const hours = this.hoursQuery.getActive() as Hours;
        const updateSubs = this.hoursService
            .putHours(hours.id, updatedHours)
            .pipe(
                tap(() => {
                    this.hoursService.updateHours(hours, updatedHours);
                    this.handleTableSelection({ message: 'reset' });
                })
            )
            .subscribe();
        this.subscriptions.push(updateSubs);
    }

    resetHours() {
        this.hoursAddedMomentSubj.next('reset');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => {
            el.unsubscribe();
        });
    }
}
