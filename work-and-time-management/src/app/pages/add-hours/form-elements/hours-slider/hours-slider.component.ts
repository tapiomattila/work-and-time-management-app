import { Component, OnInit, forwardRef, ViewChild, ElementRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { formatHours } from 'src/app/helpers/helper-functions';

@Component({
    selector: 'app-hours-slider',
    templateUrl: './hours-slider.component.html',
    styleUrls: ['./hours-slider.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => HoursSliderComponent),
        multi: true
    }]
})
export class HoursSliderComponent implements OnInit, ControlValueAccessor {
    @ViewChild('slider', { static: false }) slider: ElementRef;
    private valueSubj = new BehaviorSubject<number>(0);
    valueObs$ = this.valueSubj.asObservable();

    @Input()
    set setErrors(value: boolean) {
      this.showError = value;
    }
    showError = false;

    step = 0.25;
    sliderMin = 0;
    sliderMax = 10;
    value: number | string;

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor() { }

    ngOnInit() {
        this.valueObs$.subscribe(res => {
            this.value = res;
        });
    }

    getPosition(value) {
        const sliderWidth = this.slider.nativeElement.offsetWidth;
        const pos = sliderWidth / this.sliderMax;
        return (5 + (value * pos) / 1.075);
    }

    formatHoursFunc(hours: number) {
        return formatHours(hours);
    }

    getSliderValue($event) {
        this.onTouched();
        this.onChange($event.target.value);
    }

    inputValue($event) {
        const inputValue = parseFloat($event.target.value);
        this.valueSubj.next(inputValue);
    }

    writeValue(val: string): void {
        if (val === null) {
            // this.showError = true;
            this.value = 0;
        } else {
            this.showError = false;
            this.value = val;
            const value = parseFloat(val);
            this.valueSubj.next(value);
        }
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        // console.log('disabled');
    }
}
