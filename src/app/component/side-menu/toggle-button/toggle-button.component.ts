import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  menuToggle(){
    $("#sidebar-wrapper").toggleClass("side-bar-toggled");
  }
}
