/**
 * Created by Leo on 2017/12/20.
 */
import {API} from "../../config";


export const CompanyApi = {
    "searchData" : API.api + "/company/getCompanyList",
    "saveData" : API.api + "/company/saveData",
    "updateData" : API.api + "/company/updateData",
    "getDetail" : API.api + "/company/getCompanyDetail",
    "deleteData" :  API.api + "/company/deleteDataAll"
}

let fieldArr = new Array();
function field(target, propertyKey: string) {
    // target: 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    // propertyKey: 成员的名字
    fieldArr.push(propertyKey)
}

export class Company{
    companyId?:number;
    @field companyEmail?:string;
    @field companyPhone?:string;
    @field companyName?:string;
    getField(){
        return fieldArr;
    }
}




