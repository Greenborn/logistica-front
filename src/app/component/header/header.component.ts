import { Component, OnInit, Input } from '@angular/core';

import { GeneralService }   from '../../services/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;

  constructor(
    public gral:  GeneralService
  ) { }

  ngOnInit() {
  }

}
