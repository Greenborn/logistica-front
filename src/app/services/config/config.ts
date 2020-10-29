import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigProvider {

  constructor(
  ) {}

  public getConfigData(){
    return {
      "apiBaseUrl":"http://logistica-api.coodesoft.com.ar/", //  https://api.logisticatandil.com.ar/
      "distancesAction":"distances",
      "shippingsAction":"shippings",
      "usersAction":"users",
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
