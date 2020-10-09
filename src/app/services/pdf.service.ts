import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfService {
  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule  = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake         = pdfMakeModule.default;
      this.pdfMake.vfs     = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  generatePdfRoadMap( params:any ) {
    let def = {
      content: [
          this.getTitleRoadMap( params ),
          this.getTableOverviewRoadMap( params.regData.regData ),
        {
    			style: 'tableExample',
    			table: {
    				body: this.getTableRowsRoadMap( params.regData.regData, params.regData.fieldsSelected )
    			}
    		},
      ]
    };

    this.pdfMake.createPdf(def).download( params.name+params.date+'.pdf', params.onGenerate );
  }

  getTableRowsRoadMap( regData:any, fieldData:any ){
    let out = [];
    let reg = [];

    //se agrega encabezado
    for ( let c=0; c < fieldData.length; c++ ){
      reg.push( { text: fieldData[ c ].text, fillColor: '#dddddd', bold:true, fontSize: 8, border: [true, true, true, true] } );
    }
    out.push( reg );

    //se agregan campos
    for ( let i=0; i < regData.length; i++ ){
      reg = [];
      for ( let c=0; c < fieldData.length; c++ ){
        if ( regData[ i ][ fieldData[ c ].code ] == undefined ) {
          regData[ i ][ fieldData[ c ].code ] = '';
        }
        reg.push( { text:regData[ i ][ fieldData[ c ].code ], fillColor: '#FFF', fontSize: 8, border: [true, true, true, true] } );
      }
      out.push( reg );
    }

    return out;
  }

  getTableOverviewRoadMap( rData:any ){
    console.log(rData);
    let branchOfs = [];
    let out       = [];

    for ( let c = 0; c < rData.length; c++ ){
        let pos = -1;
        for ( let i=0; i < branchOfs.length; i++ ){
          if ( branchOfs[ i ][ 'office' ] == rData[ c ].destinationBranchOffice ){
            pos = i;
          }
        }

        if ( pos == -1 ){
          branchOfs.push( { office: rData[ c ].destinationBranchOffice, cant:1 } );
        } else {
          branchOfs[ pos ].cant ++;
        }
    }

    for ( let c = 0; c < branchOfs.length; c++ ){
      out.push( { text: branchOfs[ c ].office + ': ' + String( branchOfs[ c ].cant ), fontSize: 11 } );
    }

    out.push( { text: 'Total de envíos: ' + String( rData.length ), fontSize: 11, margin: [0, 0, 0, 8] } );
    return out;
  }

  getTitleRoadMap( params:any ){
    return [
      { text: 'Hoja de Ruta', fontSize: 14, bold: true, margin: [0, 0, 0, 8] },
        'Generada el: '+ params.date
      ];
  }
}
