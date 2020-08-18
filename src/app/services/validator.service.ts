
import { Injectable      } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidatorService {

  constructor() { }

  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////// VALIDACIÓN DE STRINGS //////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  public numeric:string         = '1234567890';
  public alphabeticLower:string = 'abcdefghijklmnñopqrstuvwxyz ';
  public alphabeticUpper:string = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ ';

  permitedChars(s,a:string = ''){
    let e:boolean = false;

    for (let c=0; c < a.length; c++){
      e = false;

      for (let j=0; j < s.length; j++){ if ( a[c] ==  s[j] ) { e = true; }  }

      if (!e) { return false; }
    }

    return true;
  }

  isOnlyAlphabetics(i:string, e:string = ''){
    return this.permitedChars(this.alphabeticLower + this.alphabeticUpper + e, i);
  }

  isOnlyAlphaNumeric(i:string, e:string = '') {
    return this.permitedChars(this.alphabeticLower + this.alphabeticUpper + this.numeric + e, i);
  }

  isOnlyNumeric(i:string, e:string = '') {
    return this.permitedChars(this.numeric + e, i);
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////// VALIDACIÓN DE Números //////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  esSoloNumber(n){
    let patron = /^[0-9]*$/;
    return patron.test(<string> n);
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////// EMAIL //////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  isAEmail(i:string){
    return this.permitedChars(this.alphabeticLower + this.alphabeticUpper + this.numeric + '@.', i);
  }
}
