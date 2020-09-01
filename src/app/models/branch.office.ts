export class BranchOffice {
   public id;
   public name;
   public status;
   public incomingShipping:any = [
     {
       "id": 0,
       "origin_full_name": "",
       "origin_contact": "",
       "destination_full_name": "",
       "destination_contact": "",
       "origin_address": null,
       "destination_address": null,
       "price": 0,
       "date": "",
       "status":""
     }
   ];

   public outgoingShipping:any = [
     {
       "id": 0,
       "origin_full_name": "",
       "origin_contact": "",
       "destination_full_name": "",
       "destination_contact": "",
       "origin_address": null,
       "destination_address": null,
       "price": 0,
       "date": "",
       "status":""
     }
   ];

}
