import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { GeneralService }    from '../../../services/general.service';
import { ResultPageService } from './result.page.service';

@Component({
  selector:    'result-page',
  templateUrl: 'result.html',
  styleUrls: ['./result.scss'],
})
export class ResultPage {

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public acRoute:        ActivatedRoute,
    public resultPageS:    ResultPageService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(){

  }

  next(){
    if ( this.resultPageS.getConfig().afterNext != undefined ){
      this.resultPageS.getConfig().afterNext();
    }
  }

}
