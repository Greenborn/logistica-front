import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigProvider {

  constructor(
  ) {}

  public getConfigData(){
    return {
      "apiBaseUrl":"https://api.logisticatandil.com.ar/", //  logistica-api.coodesoft.com.ar
      "distancesAction":"distances",
      "shippingsAction":"shippings",
      "branchOfficesAction":"branch-offices",
      "shippingTypesAction":"shipping-types",
      "servicesAction":"service-types",
      "servicesIdentificationType":"identification-types",
      "loginAction":"login",
      "vehiclesAction":"vehicles",
      "roadMapAction": "roadmaps"
    };
  }

}
