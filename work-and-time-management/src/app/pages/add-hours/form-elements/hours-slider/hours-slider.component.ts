import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-hours-slider',
    templateUrl: './hours-slider.component.html',
    styleUrls: ['./hours-slider.component.scss']
})
export class HoursSliderComponent implements OnInit {

    @ViewChild('slider', { static: false }) slider: ElementRef;
    sliderValue = 0;
    step = 0.25;
    sliderMin = 0;
    sliderMax = 16;
    @Input() sliderObsValue = 0;

    @Input() parentForm: FormGroup;
    @Input() controlName: string;

    constructor() { }

    ngOnInit() { }

    getSliderValue(event) {
        this.sliderValue = event.target.value;
    }

    getPosition(value) {
        const sliderWidth = this.slider.nativeElement.offsetWidth;
        const pos = sliderWidth / this.sliderMax;
        return (5 + (value * pos) / 1.075);
    }
}
