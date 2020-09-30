import { Component, OnInit } from '@angular/core';

import { SideMenuService } from './side-menu.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  constructor(
    public service: SideMenuService
  ) { }

  ngOnInit() {
  }

  mainOptionClick( i:number ){

    this.service.getOptions()[ i ].collapsed = !this.service.getOptions()[ i ].collapsed;

    if ( this.service.getOptions()[ i ].onClick != undefined ){
      this.service.getOptions()[ i ].onClick();
    }

  }

}
