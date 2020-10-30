import { Subject }    from 'rxjs';

export class OutputTableModel {
  public regsSelected:any;
  public regData:any;
  public fieldsSelected:any;
  public filtersUsed:any;
  public onChangeRegSelected = new Subject();
}
