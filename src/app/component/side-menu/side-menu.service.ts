import { Injectable } from '@angular/core';

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
    if ( option.onClick == null || option.onClick == undefined ){
      option.onClick = ()=>{};
    }
    this.links.push(option);
  }

  public clearOptions(){
    this.links = [];
  }

  public getOptions(){
    return this.links;
  }

  constructor() { }
}
