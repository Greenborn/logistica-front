export class Shipping {
    public id;
    public origin_full_name;
    public origin_contact;
    public destination_full_name;
    public destination_contact;
    public origin_address;
    public destination_address;
    public items:any = [];

    public distance_id;
    public service_type_id;
    public shipping_type_id:number = 1;
    public destination_branch_office;

    public price;
    public date;
    public status;
}
