/**
 * Created by eason on 2018/11/30.
 */
import {API} from "../../config";

export const globalSearchApi = {
    "getObjModules" : API.api + "/powerSearch/getObjModules",
    "getObjsList" : API.api + "/powerSearch/getObjs",
}

export class GlobalSearchModule{
    keywordField?:string;
    moduleCount?:number;
    objTitleTitle?:string;
    objTypeId?:number;
}

export class GlobalSearchParam{
    keyword?:string;
    objTypeId?:string;
    objTitleTitle?:string;
}

export class GlobalSearch{
    objId?:number;
    keyword?:string;
    objDesc?:number;
    objTitle?:string;
    objTypeId?:number;
    objTypeName?:string;
}
