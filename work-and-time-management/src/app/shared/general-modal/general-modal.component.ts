import { Component, OnInit } from '@angular/core';
import { ManageService } from 'src/app/pages/manage,service';

@Component({
  selector: 'app-general-modal',
  templateUrl: './general-modal.component.html',
  styleUrls: ['./general-modal.component.scss']
})
export class GeneralModalComponent implements OnInit {

  constructor(
    private manageService: ManageService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.manageService.setGeneralModal(false);
  }
}
