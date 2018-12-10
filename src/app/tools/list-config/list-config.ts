/**
 * Created by Leo on 2017/12/15.
 */
import {API} from "../../config";

export const ListConfApi = {
    "getModuleList" : API.api + "/conf/getModuleListBySelect",
    "getListItem" : API.api + "/conf/getRefOptionTypeList",
    "addListItem" : API.api + "/conf/saveRefOptionType",
    "editListItem" : API.api + "/conf/updateRefOptionType",
    "getItemOpts" : API.api + "/conf/searchRefOptionByTypeId",
    "getOptDetail" : API.api + "/conf/getRefOptionDetailByOptionId",
    "addOpt" : API.api + "/conf/saveRefOption",
    "updateOpt" : API.api + "/conf/updateRefOption"
}


export class ListItem{
    typeId? : number;
    typeNameEn? : string;
    typeNameCn? : string;
    typeNameTc? : string;
    moduleName? : string;
}

export class ListItemOption{
    optionId? : number;
    typeId? : number;
    optionKey? : string;
    optionNameEn? : string;
    optionNameCn? : string;
    optionNameTc? : string;
    parentId? : number;
    sort? : number;
    moduleName? : string;
}