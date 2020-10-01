import { Subject }    from 'rxjs';

export class OutputTableModel {
  public regsSelected:any;
  public onChangeRegSelected = new Subject();
}
