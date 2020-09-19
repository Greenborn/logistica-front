import { Component, OnInit, Input } from '@angular/core';

import { GeneralService }   from '../../services/general.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  constructor(
    public gral:  GeneralService
  ) { }

  ngOnInit() {
  }

}
