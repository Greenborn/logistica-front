export class Shipping {
    public id;
    public origin_full_name;
    public origin_contact;
    public destination_full_name;
    public destination_contact;
    public origin_address;
    public destination_address;
    public sender_identification:any = { "type": 1, "value" : "" };
    public receiver_identification:any = { "type": 1, "value" : "" };
    public items:any = [];
    public price;

    public distance_id:number;
    public vehicle_id:number;
    public service_type_id:number;
    public shipping_type_id:number = 1;
    public destination_branch_office;
    public vehicle;

    public payment_at_origin:any = true;

    public date;
    public status;

    public setValuesFromResponse( response:any ){
      this.sender_identification.type    = response.sender_identification.identification_type.id;
      this.receiver_identification.type  = response.receiver_identification.identification_type.id;
      this.destination_branch_office     = response.destinationBranchOffice.id;
      this.service_type_id               = response.serviceType.id;
      this.distance_id                   = response.distance.id;
      this.shipping_type_id              = response.shippingType.id;
      this.status                        = response.status.id;

      this.origin_full_name      = response.origin_full_name;
      this.origin_contact        = response.origin_contact;
      this.id                    = response.id;
      this.destination_full_name = response.destination_full_name;
      this.destination_contact   = response.destination_contact;
      this.origin_address        = response.origin_address;
      this.destination_address   = response.destination_address;
      this.price                 = response.price;
      this.date                  = response.date;

      this.sender_identification.value   = response.sender_identification.value;
      this.receiver_identification.value = response.receiver_identification.value;

      if ( response.vehicle != null ){
        this.vehicle_id = response.vehicle.id;
      }

      for( let c=0; c < response.shippingItems.length; c++ ){
        this.items.push( { description: response.shippingItems[ c ].item, id: response.shippingItems[ c ].id } );
      }

    }
}
