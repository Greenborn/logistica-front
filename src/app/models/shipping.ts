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

    public distance_id:number;
    public vehicle_id:number;
    public service_type_id:number;
    public shipping_type_id:number = 1;
    public destination_branch_office;

    public price;
    public remitos:any;
    public originBranchOffice;
    public payment_at_origin:any = true;

    public date;
    public status;
}
