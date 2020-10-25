//Este componete tiene como finalida centralizar el formateo de datos generícos
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormateoService {

  constructor() { }

  public DECIMAL_SEPARATOR:string = ",";
  public GROUP_SEPARATOR:string   = ".";
  public CUIL_SEPARATOR:string    = '-';
  public DATE_SEPARATOR:string    = '/';
  public DIAS_POR_MES             = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];

  public ISODate:string  = '';
  public anio:number    = 0;
  public mes:number     = 0;
  public dia:number     = 0;
  public hora:number    = 0;
  public minuto:number  = 0;
  public segundo:number = 0;

  public MAYOR = 1;
  public MENOR = -1;
  public IGUAL = 0;

  /////////////////////////
  ///// TARJETAS
  formatCardNumber(valString) {
    if (!valString) {
        return '';
    }
    let val    = valString.toString();
    let number = this.unFormatMoney(val);

    return number.replace(/\B(?=(?:\d{4})+(?!\d))/g, '-');
  }

  /////////////////////////
  //// FECHAS          ////
  getTimeStampFNgbDatePickerA( date:any ) {
    if ( date == undefined ){
      return '';
    }
    let fecha = this.getDateNgbDatepickerArray( date ).getTime();

    return fecha;
  }

  getSDateFromTimeStamp( t:number ){
    let f = new Date( t * 1000 );
    return this.getStringDate( f );
  }

  getFormatedDate(f = '', format='YYYY-MM-DD'){
      if (f != ''){
        let d : any = this.getArrayFDate(f);
        // esto se puede hacer de forma mejor pero, en otro momento me
        if (format == 'YYYY-MM-DD') { return d[0]+"-"+d[1]+"-"+d[2]; } //0 1 2
        if (format == 'DD-MM-YYYY') { return d[2]+"-"+d[1]+"-"+d[0]; }
      }
  }

  getDateGoogle(f){
    return f.getFullYear()+'-'+("0" + (f.getMonth() + 1)).slice(-2)+'-'+("0" + f.getDate()).slice(-2)+"+"+("0" + f.getHours()).slice(-2)+':'+("0" + f.getMinutes()).slice(-2);
  }

  getStringDate(d){
    return d.getDate() + this.DATE_SEPARATOR + (Number( d.getMonth() ) + 1)  + this.DATE_SEPARATOR + d.getFullYear();
  }

  getArrayFDate(f){
    if (typeof(f) != 'string'){
      if ('_isAMomentObject' in f) { f = new Date(f._d).toISOString();}
    }
    let d : any = f.split("T")[0];
    return d.split("-");
  }

  setIsoString(f){
    this.ISODate = f;
    let fecha    = f.split('T')[0].split('-');
    let hora     = f.split('T')[1].split('-')[0].split(':');
    this.anio    = fecha[0];
    this.mes     = fecha[1]-1;
    this.dia     = fecha[2];
    this.hora    = hora[0];
    this.minuto  = hora[1];
    this.segundo = hora[2];
  }

  getFechaISO(fecha){
    let f = this.getArrayFDate(fecha);
    return <string> new Date(f[0],f[1]-1,f[2],0,0,0).toISOString();
  }

  getFechaISOASP(fecha){
    let f = this.getArrayFDate(fecha);
    return <string> f[0]+'-'+f[1]+'-'+f[2]+'T'+'00:00:00.000Z';
  }

  getNgbDatepickerArrayFISO(d){
    let f = new Date(d);
    return { 'year':  f.getFullYear(),
             'month': f.getMonth()+1,
             'day':   f.getDate() };
  }

  getNgbDatepickerArrayString(d:any){
    if ( d === null){ return {}; }

    if ( d.hasOwnProperty('year') || (!d.hasOwnProperty('year') && typeof d !== 'string') ){ //ya tiene el formato esperado se retorna o mismo
      return d;
    }

    let dArray:any = d.split(this.DATE_SEPARATOR);

    if (dArray.length != 3){
      return {};
    }

    if ( parseInt(dArray[1]) > 12 || parseInt(dArray[1]) < 0){
      return {};
    }

    if (dArray[1] == 2 && (parseInt(dArray[2]) % 4 == 0 && parseInt(dArray[2]) % 100 != 0) || parseInt(dArray[2]) % 400 == 0){
      this.DIAS_POR_MES[1] = 29;
    }

    if (dArray[0] > this.DIAS_POR_MES[ dArray[1] - 1 ] || dArray[0] < 0){
      return {};
    }

    if (parseInt(dArray[2]).toString().length != 4){
      return {};
    }

    return { 'year':  parseInt(dArray[2]),
             'month': parseInt(dArray[1]),
             'day':   parseInt(dArray[0])  };
  }

  getFISONgbDatepickerArray(d){
    if ( !d.hasOwnProperty('year') ){ return d; }

    return new Date(d.year, d.month-1, d.day).toISOString();
  }

  getDateNgbDatepickerArray(d){
    if ( !d.hasOwnProperty('year') ){ return; }

    return new Date(d.year, d.month-1, d.day);
  }

  //////////////////////////
  //// NÚMEROS           ///
  getFloatLA(val){
     if (!val) { return ''; }
     val = val.toString().split( this.GROUP_SEPARATOR );
     if ( val.length < 2 ){
      val[1]='00';
     }
     return val[0]+this.DECIMAL_SEPARATOR+val[1].slice(0, 2);
  }


  //////////////////////////
  //// MONEDAS          ////
  getLocaleMoneyF(v, signo=1){
    let val:string;
    let va2 = String(v).split(this.GROUP_SEPARATOR);

    if (va2.length == 2){
      if (va2[1].length == 1){
        va2[1] = String(va2[1]) +'0';
      } else if(va2[1].length > 2) {
        va2[1] = String(va2[1]).slice(0,1);
      }

      val = va2[0]+','+va2[1];
    } else {
      val = va2[0]+',00';
    }

    if (val[val.length-1] == '-'){ signo = -1; }

    let parts = this.unFormatMoney(val).split(this.DECIMAL_SEPARATOR);
    if(parts[1]) { parts[1] = parts[1].slice(0, 2);}
    if(val.slice(-1)===this.DECIMAL_SEPARATOR) {parts[0]+=this.DECIMAL_SEPARATOR;}
    let s = '';

    if(signo == -1){
      s='-';
    }

    let ent = parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);
    if (ent == ''){ ent = '0'; }

    return "$ "+s+ ent + (!parts[1] ? '' :this.DECIMAL_SEPARATOR+ parts[1]);
  }

  unFormatMoney(val) {
      if (!val) { return ''; }

      val = val.replace(/^0+/, '');
      let s:string='';
      if (this.GROUP_SEPARATOR === ',') {
        s=val.replace(/[^0-9\.]/g, '');
      } else { s=val.replace(/[^0-9,]/g, '');}
      return s;
  }

  getFloat(val) {
      if (!val) { return '';  }

      val = (val as string).replace(/^0+/, '');
      let s:string='';
      s=val.replace(/[^0-9,]/g, '');
      s=s.replace(',','.');
      if(s==".00") { s='0.00'; }
      return s;
  }

  esSoloNumber(n){  let patron = /^[0-9]*$/;  return patron.test(<string> n); }

  //////////////////////////
  //// CUIL            /////
  getCuilString(c){
    let s = String(c);
    return s.substring(0, 2) + this.CUIL_SEPARATOR + s.substring(2, s.length-1) + this.CUIL_SEPARATOR + s[s.length-1];
  }

  public cuitMask = [/[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-' , /[0-9]/];

  //////////////////////////
  ///// BOOLEAN
  getTextOfBoolean( bool:number ){
    if ( bool ) {
      return 'Si';
    }
    return 'No';
  }

  //////////////////////////
  //// TARJETA         /////
  public cardMask = [/[0-9]/, /[0-9]/,/[0-9]/,/[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
}
