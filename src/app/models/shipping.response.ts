export class ShippingResponse {
    public id;
    public origin_full_name;
    public origin_contact;
    public destination_full_name;
    public destination_contact;
    public origin_address;
    public destination_address;
    public sender_identification:any = { "type": 1, "value" : "" };
    public receiver_identification:any = { "type": 1, "value" : "" };
    public shippingItems:any = [];

    public distance_id;
    public serviceType;
    public shipping_type_id:number = 1;
    public destinationBranchOffice;

    public price;
    public payment_at_origin:any = true;

    public date;
    public status;

    public items;  //[MODIFICAR] despues agregaré un metodo o algo para no tener propiedades que no se usan en este modelo pero si son necesarias en el usado para hacer post y put
    public service_type_id;
    public destination_branch_office;
}
