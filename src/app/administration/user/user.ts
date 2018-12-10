/**
 * Created by Leo on 2017/12/5.
 */

import {API} from "../../config";

let fieldArr = new Array();
function field(target, propertyKey: string) {
    // target: 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    // propertyKey: 成员的名字
    fieldArr.push(propertyKey)
}

export class User{
    @field loginName?:string;
    @field email?:string;
    @field mobilePhone?:string;
    @field directPhone?:string;
    @field address1?:string;
    @field address2?:string;
    @field password?:string;
    @field title?:string;
    @field lastName?:string;
    @field firstName?:string;
    @field displayName?:string;
    @field firstLogin?:number;
    @field roleId?:string;
    @field status?:number;
    getField(){
        return fieldArr;
    }
}

export const UserApi = {
    "getRoleList" : API.api + "/menuRole/getRoleSelectData",
    "getList" : API.api + "/user/getUserList",
    "getDetail" : API.api + "/user/getUserData",
    "onSave" : API.api + "/user/updateUser",
    "onDelete" : API.api + "/user/deleteUser",

}