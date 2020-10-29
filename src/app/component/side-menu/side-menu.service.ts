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
  private authService:any;

  public setAuthSInstance( authS:any ){
    if ( authS == null || authS == undefined ){
      console.error('[side-menu service] Servicio de autenticación no definido');
      return;
    }
    this.authService = authS;
  }

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

  private isAuthorized( option:any ){
    let authorized:boolean = false;
    let role:string        = this.authService.getRole();

    if ( !option.hasOwnProperty( 'permisions' ) ){
      return false;
    }

    if ( role == undefined || role == null ){
      this.authService.toLogOut();
    }
    for ( let c=0; c < option.permisions.length; c++ ){
      authorized = authorized || ( option.permisions[ c ].role == role ) || ( option.permisions[ c ].role == '@all' );
    }
    return authorized;
  }

  public addOption( option:any ){
    if ( !this.isAuthorized( option ) ){
        return;
    }

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
        if ( option.onClick == undefined ){
          option.subOptions[ c ].onClick = ()=>{ };
        }
      }

      if ( !this.isAuthorized( option.subOptions[ c ] ) ){
        option.subOptions.splice( c, 1 );
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
