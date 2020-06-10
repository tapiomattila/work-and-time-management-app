import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-back-arrow',
  templateUrl: './back-arrow.component.html',
  styleUrls: ['./back-arrow.component.scss'],
})
export class BackArrowComponent implements OnInit {

  @Output() backPressed = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  backArrowClicked() {
    this.backPressed.emit();
  }

}
