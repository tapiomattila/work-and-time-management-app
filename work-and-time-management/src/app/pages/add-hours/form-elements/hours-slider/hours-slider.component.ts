import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-hours-slider',
    templateUrl: './hours-slider.component.html',
    styleUrls: ['./hours-slider.component.scss']
})
export class HoursSliderComponent implements OnInit {

    @ViewChild('slider', { static: false }) slider: ElementRef;
    sliderValue = '0h';

    @Input()
    set setSliderValue(value: string) {
        console.log('in set slider value', value);
        if (value) {
            console.log('SET SLIDER', value);
            this.sliderValue = value;
        } else {
            console.log('in else');
            this.sliderValue = '0h';
        }
    }
    @Input() sliderObsValue = 0;

    step = 0.25;
    sliderMin = 0;
    sliderMax = 10;

    @Input() parentForm: FormGroup;
    @Input() controlName: string;

    constructor() { }

    ngOnInit() { }

    getSliderValue(event) {
        // this.sliderValue = event.target.value;

        const frac = event.target.value % 1;

        if (frac === 0) {
            this.sliderValue = `${event.target.value.toString()}h`;
        } else {
            const full = event.target.value - frac;
            this.sliderValue = `${full}h ${frac * 60}min`;
        }
    }

    getPosition(value) {
        const sliderWidth = this.slider.nativeElement.offsetWidth;
        const pos = sliderWidth / this.sliderMax;
        return (5 + (value * pos) / 1.075);
    }

    formatHours(hours: number) {
        const frac = hours % 1;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        const full = hours - frac;
        return `${full}h ${frac * 60}min`;
    }
}
