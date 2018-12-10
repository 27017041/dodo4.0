/**
 * Created by Leo on 2017/11/27.
 */
import {API} from "../../config";

let fieldArr = new Array();
function field(target, propertyKey: string) {
    // target: 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    // propertyKey: 成员的名字
    fieldArr.push(propertyKey)
}

export class Role{
    @field roleName?:string;
    @field status?:number;
    getField(){
        return fieldArr;
    }
}

export const RoleApi = {
    "getList":API.api + "/role/gridData",
    "getDetail":API.api + "/role/getRoleData",
    "save":API.api + "/role/updateData",
    "onDelete":API.api + "/role/deleteData"
}

