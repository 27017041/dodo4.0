/**
 * Created by Leo on 2017/12/20.
 */
import {API} from "../../config";

export const ModuleApi = {
    "getModule" : "",
    "searchData" : "",
    "saveData" : "",
    "updateData" : "",
    "getDetail" : "",
    "deleteData" : "",
    "getLinkageModuleList" : API.api + "/relational/getLinkageModuleList",
    "getLinkageModuleListById" : API.api + "/relational/getLinkageModuleListById",
    "getRelational" : API.api + "/relational/getCoreRelational"
}

class Field{
    fieldId?:number;
    fieldLabel?:string;
    fieldType?:string;
    labelText?:string;
    moduleName?:string;
    isDisplay?:number;
}

export class SearchField extends Field{
    searchItemId?:number;
    sorting?:number;
}

export class GridField extends Field{
    gridItemId?:number;
    sorting?:number;
}

export class FormField extends Field{
    formItemId?:number;
    sorting?:number;
}



