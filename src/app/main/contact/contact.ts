/**
 * Created by Leo on 2017/12/20.
 */
import {API} from "../../config";


export const ContactApi = {
    "searchData" : API.api + "/contact/getContactList",
    "saveData" : API.api + "/contact/saveData",
    "updateData" : API.api + "/contact/updateData",
    "getDetail" : API.api + "/contact/getContactDetail",
    "deleteData" :  API.api + "/contact/deleteDataAll"
}

let fieldArr = new Array();
function field(target, propertyKey: string) {
    fieldArr.push(propertyKey);
}

export class Contact{
    contactId?:number;
    clientId?:number;
    @field companyEmail?:string;
    @field companyPhone?:string;
    @field companyName?:string;
    getField(){
        return fieldArr;
    }
}




