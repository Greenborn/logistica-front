import { Injectable } from '@angular/core';
import { Router }     from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  private menuTitle:string     = 'sin titulo';
  private displayTitle:boolean = false;
  private links:any            = [];
  public  menuVisible:boolean  = true;

  public toggleMenu(){
    this.menuVisible = !this.menuVisible;
  }

  public getMenuTitle(){
    return this.menuTitle;
  }

  public setMenuTitle(t:string){
    this.menuTitle = t;
  }

  public hideTitle(){
    this.displayTitle = false;
  }

  public showTitle(){
    this.displayTitle = true;
  }

  public isTitleVisible(){
    return this.displayTitle;
  }

  public addOption( option:any ){
    if ( option.hasOwnProperty( 'link' ) ){
      option.onClick = () => { this.router.navigate( [ option.link ] ); };
    }
    if ( option.onClick == undefined ) {
      option.onClick = ()=>{ };
    }

    for ( let c = 0; c < option.subOptions.length; c++ ){
      if ( option.subOptions[ c ].link != undefined ){
        option.subOptions[ c ].onClick = () => { this.router.navigate( [ option.subOptions[ c ].link ] ); };
      } else {
        option.subOptions[ c ].onClick = ()=>{ };
      }
    }

    this.links.push(option);
  }

  public clearOptions(){
    this.links = [];
  }

  public getOptions(){
    return this.links;
  }

  constructor(
    public  router: Router,
  ) { }
}
