import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatHours } from 'src/app/helpers/helper-functions';

@Component({
    selector: 'app-hours-slider',
    templateUrl: './hours-slider.component.html',
    styleUrls: ['./hours-slider.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HoursSlider22Component),
            multi: true,
        },
    ],
})
export class HoursSlider22Component implements ControlValueAccessor, OnInit {
    @Input()
    set setErrors(value: boolean) {
        this.showError = value;
    }
    @Input() rangeValue: number | string = '0';

    rangeConfig = {
        step: 0.25,
        min: '0',
        max: '10',
    };
    showError = false;

    onChange: any = () => {};
    onTouched: any = () => {};

    constructor() {}

    ngOnInit() {}

    getSliderValue($event) {
        this.onTouched();
        this.onChange($event.target.value);
        this.rangeValue = $event.target.value;
    }

    getDynamicInputValue(event) {
        this.rangeValue = event.target.value;
    }

    formatHoursFunc(hours: number | string) {
        let hoursSet: number;
        if (typeof hours === 'string') {
            hoursSet = parseFloat(hours);
        } else {
            hoursSet = hours;
        }
        return formatHours(hoursSet);
    }

    writeValue(val: string): void {}

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {}
}
