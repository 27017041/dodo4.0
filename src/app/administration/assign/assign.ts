import {API} from "../../config";
/**
 * Created by Leo on 2017/12/4.
 */

export class Assign{
    roleId?:number
}

export const AssignApi = {
    "getRoleList" : API.api + "/menuRole/getRoleSelectData",
    "getMenuList" : API.api + "/menuTest/getMenuMap",
    "getRoleMap" : API.api + "/menuRole/getRoleRightMap",
    "onSave" : API.api + "/menuRole/updateRoleRight",
}