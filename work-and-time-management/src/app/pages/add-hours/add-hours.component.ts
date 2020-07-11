import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkType, WorkTypeQuery } from 'src/app/worktype/state';
import { map } from 'rxjs/operators';

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

    selectedWorksiteValue: string;
    dataForm: FormGroup;
    maxDate = new Date();

    step = 0.25;
    sliderMin = 0;
    sliderMax = 16;

    momentDay: moment.Moment;

    constructor(
        private worksiteQuery: WorksitesQuery,
        private worksiteService: WorksitesService,
        private worktypeQuery: WorkTypeQuery,
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

    ngAfterViewInit() {
        // console.log(this.slider);
    }

    selectionDayHours() {
        this.dayHours$ = this.worksiteQuery.selectHoursForSelectedDay()
            .pipe(
                map(el => {
                    const frac = el % 1;

                    if (frac === 0) {
                        return `${el.toString()}h`;
                    }

                    const full = el - frac;
                    return `${full}h ${frac * 60}min`;
                })
            );
    }

    formValueChanges() {
        this.dataForm.valueChanges.subscribe(data => {
            this.momentDay = moment(data.date);

            if (data.date) {
                const date = data.date as Date;
                this.worksiteQuery.setAddHoursDateSelection(date.getTime());
            }
        });
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
