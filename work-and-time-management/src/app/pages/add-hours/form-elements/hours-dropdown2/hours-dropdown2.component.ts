import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Worksite } from 'src/app/pages/worksites/state';
import { WorkType } from 'src/app/pages/worktype/state';

@Component({
  selector: 'app-hours-dropdown2',
  templateUrl: './hours-dropdown2.component.html',
  styleUrls: ['./hours-dropdown2.component.scss']
})
export class HoursDropdown2Component implements OnInit {

  @Output() itemSelection = new EventEmitter();
  @Input()
  set activeSelection(value: Worksite | WorkType) {
    this.selectedItem = value;
  }
  @Input() defaultName = '';
  @Input()
  set content(values: WorkType[] | Worksite[]) {
    this.contents = [...values];
  }

  contents = [];
  show = false;
  scrollOver = false;
  selectedItem: WorkType | Worksite;

  constructor() { }

  ngOnInit() {
    this.contents.length > 5 ? this.scrollOver = true : this.scrollOver = false;
  }

  dropdownShow() {
    this.show = !this.show;
  }

  selectElement(el: WorkType | Worksite) {
    this.selectedItem = el;
    this.show = !this.show;
    this.itemSelection.emit(el);
  }

  reset() {
    this.selectedItem = undefined;
    this.show = !this.show;
  }

}
