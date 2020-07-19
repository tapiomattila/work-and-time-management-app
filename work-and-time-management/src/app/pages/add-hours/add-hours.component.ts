import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkType, WorkTypeQuery } from 'src/app/worktype/state';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';
import { HoursQuery } from 'src/app/auth/hours';

@Component({
    selector: 'app-add-hours',
    templateUrl: './add-hours.component.html',
    styleUrls: ['./add-hours.component.scss']
})
export class AddHoursComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('slider', { static: false }) slider: ElementRef;
    slider$: Observable<number>;
    sliderValue = 0;
    subscriptions: Subscription[] = [];

    worksite$: Observable<Worksite>;
    worksites$: Observable<Worksite[]>;
    worktypes$: Observable<WorkType[]>;
    dayHours$: Observable<string>;
    dayTableHours$: Observable<object[]>;

    selectedWorksiteValue: string;
    dataForm: FormGroup;
    maxDate = new Date();

    step = 0.25;
    sliderMin = 0;
    sliderMax = 16;

    showFormData = true;

    momentDay: moment.Moment;

    constructor(
        private worksiteQuery: WorksitesQuery,
        private worksiteService: WorksitesService,
        private worktypeQuery: WorkTypeQuery,
        private hoursQuery: HoursQuery,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.worksites$ = this.worksiteQuery.selectAll();
        this.worktypes$ = this.worktypeQuery.selectAll();
        this.initForm();
        this.momentDay = moment();
        this.worksiteQuery.setAddHoursDateSelection(new Date().getTime());

        this.route.params.subscribe((params: Params) => {
            if (params.id) {
                this.worksiteService.setActive(params.id);
            }
        });

        const activeWorksite$ = this.worksiteQuery.selectActiveWorksite();
        this.worksite$ = activeWorksite$;

        this.selectionDayHours();
        this.formValueChanges();

        const activeWorkSiteSubs = activeWorksite$.subscribe((active: Worksite) => {
            if (active) {
                this.selectedWorksiteValue = active.nickname;
            }
        });

        this.slider$ = this.dataForm.controls.slider.valueChanges;
        this.subscriptions.push(activeWorkSiteSubs);
    }

    ngAfterViewInit() {}

    selectionDayHours() {
        this.dayHours$ = this.worksiteQuery.selectHoursForSelectedDay()
            .pipe(
                map(el => {
                    return this.formatHours(el);
                })
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

                    this.dayTableHours$ = this.hoursQuery.selectHoursForDay(date.getTime(), this.worksiteQuery.getActiveId())
                        .pipe(
                            map(elements => {
                                return elements.map(el => {
                                    const worksiteName = this.worksiteQuery.getWorksiteById(el.worksiteId);
                                    const worksiteNameFound = worksiteName ? worksiteName[0].nickname : undefined;

                                    const worktypeId = this.hoursQuery.getHourWorktype(el.id);
                                    const worktype = this.worktypeQuery.getWorktypeById(worktypeId);
                                    const worktypeNameFound = worktype ? worktype.viewName : undefined;

                                    const formattedDate = moment(el.updatedAt).format('DD.MM.YYYY');
                                    const hours = this.formatHours(el.markedHours);

                                    return {
                                        id: el.id,
                                        updateAtOrig: el.updatedAt,
                                        updateAt: formattedDate,
                                        worksiteId: el.worksiteId,
                                        worksiteName: worksiteNameFound,
                                        worktypeId,
                                        worktypeName: worktypeNameFound,
                                        hoursOrig: el.markedHours,
                                        hours
                                    };
                                });
                            }),
                        );
                }
            });
    }

    formatHours(hours: number) {
        const frac = hours % 1;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        const full = hours - frac;
        return `${full}h ${frac * 60}min`;
    }

    toggleFormData() {
        this.showFormData = !this.showFormData;
    }

    getPosition(value) {
        const sliderWidth = this.slider.nativeElement.offsetWidth;
        const pos = sliderWidth / this.sliderMax;
        return (5 + (value * pos) / 1.075);
    }

    initForm() {
        this.dataForm = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            worksite: new FormControl(null, Validators.required),
            worktype: new FormControl(null, Validators.required),
            slider: new FormControl(null, Validators.required)
        });
    }

    getSliderValue(event) {
        this.sliderValue = event.target.value;
    }

    worksiteOption(worksite: Worksite) {
        this.worksiteService.setActive(worksite.id);
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    toggleDatePicker(picker) {
        picker.open();
    }

    onSubmit() {
        if (!this.dataForm.valid) {
            console.log(this.slider);
            console.log('INVALID FORM');
            return;
        }

        const values = this.dataForm.value;
        console.log('show values', values);

        const data = {
            date: new Date().toISOString(),
            worksite: values.worksite,
            worktype: values.worktype,
            time: values.slider
        };
        console.log('show data ', data);
    }

    ngOnDestroy() {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(el => el.unsubscribe());
        }
    }

}
