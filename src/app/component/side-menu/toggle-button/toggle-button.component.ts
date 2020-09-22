import { Component, OnInit } from '@angular/core';
import { SideMenuService } from './../side-menu.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit {

  constructor(
    public service: SideMenuService
  ) { }

  ngOnInit() {}

  menuToggle(){
    this.service.toggleMenu();
  }
}
