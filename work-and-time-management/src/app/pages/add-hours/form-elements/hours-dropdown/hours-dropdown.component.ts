import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Worksite } from 'src/app/pages/worksites/state';
import { WorkType } from 'src/app/pages/worktype/state';

@Component({
  selector: 'app-hours-dropdown',
  templateUrl: './hours-dropdown.component.html',
  styleUrls: ['./hours-dropdown.component.scss']
})
export class HoursDropdownComponent implements OnInit {

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

  clickOutsideEvent() {
    this.show = false;
  }
}
