/**
 * Created by Leo on 2017/12/8.
 */
import {API} from "../../config";

export const ModuleConfApi = {
    getModuleList :  API.api + "/conf/getModuleList",
    getModuleDetail : API.api + "/conf/getModuleDetail",
    getConfListByName : API.api + "/conf/getFieldInModuleView",
    getFieldList : API.api + "/conf/getAllFieldInModule",
    getLabelType : API.api + "/conf/getLabelType",
    getSelectOption : API.api + "/conf/getSelectOption",

    addConf : API.api + "/conf/saveFieldInView",
    updateConf : API.api + "/conf/updateFiledSortInView",
    deleteConf : API.api + "/conf/deleteFieldInView",

    addField : API.api + "/conf/saveField",
    updateFieldInModule : API.api + "/conf/updateFieldInModule",
    deleteFieldInModule : API.api + "/conf/deleteFieldInModule",
    getLabelOriginalList : API.api + "/conf/getLabelOriginalListBySelect",

    addRelational : API.api + "/conf/saveRelational",

    getRelationalById : API.api + "/conf/getRelationalById",
    getTableFields : API.api + "/conf/getTableFields",
    addRelationalItem : API.api + "/conf/saveRelationalItem",
    deleteRelational : API.api + "/conf/deleteRelational",
    reloadRelationalAndItem : API.api + "/conf/getRelationalById",
    updateRelationalItem : API.api + "/conf/updateRelationalItem",
    updateSortInRelationalItem : API.api + "/conf/updateSortInRelationalItem",
    deleteRelationalItem : API.api + "/conf/deleteRelationalItem"
}

export class ModuleConfig{
    fieldList? : Array<ModuleField>;
    searchFieldList? : Array<ModuleSearch>;
    gridFieldList? : Array<ModuleGrid>;
    formFieldList? : Array<ModuleForm>;
    module? : Module;

    constructor(conf:ModuleConfig){
        this.fieldList = conf.fieldList;
        this.searchFieldList = conf.searchFieldList;
        this.gridFieldList = conf.gridFieldList;
        this.formFieldList = conf.formFieldList;
        this.module = conf.module;
    }
}

export class ConfLabel{
    labelId? : number;
    labelText? : string;
    lang? : string;
    module? : string;
    labelOrginal? : string;
    labelType? : number;
    labelTextCn? : string;
    labelTextTc? : string;
    labelTextEn? : string;
}

export class ModuleField extends ConfLabel{
    fieldId? : number;
    fieldLabel? : string;
    fieldType? : string;
    moduleName? : string;
    validation? : string;
    pattern? : string;
    selectTypeId? : number;
    minValue? : number;
    maxValue? : number;
    minLengthValue? : number;
    maxLengthValue? : number;
    isDisplay?:number;
    isDisabled?:number;
    isReadonly?:number;
    isLinkage?:number;
    linkageModule?:Array<string>;
    linkageViews?:string;
    linkageKey?:string;
}

class ModuleSearch extends ModuleField{
    labelText? : string;
    searchItemId? : number;
    sorting? : number;
}

class ModuleGrid extends ModuleField{
    labelText? : string;
    gridItemId? : number;
    sorting? : number;
}

class ModuleForm extends ModuleField{
    labelText? : string;
    formItemId? : number;
    sorting? : number;
}

class Module{
    createLink? : string;
    deleteLink? : string;
    isCustom? : string;
    moduleName? : string;
    readLink? : string;
    updateLink? : string;
}

export class Relational{
    moduleName?:string;
    relationalName?:string;
    tableName?:string;
    tableField?:string;
    isDelete?:number;
    deleteUrl?:string;
    isHistory?:number;
    historyUrl?:string;
    tableKey?:string;
}

export class RelationalItem extends Relational{
    relationalId?:number;
    fieldName?:string;
    sort?:number;
    isLink?:number;
    linkUrl?:string;
    isDisplay?:number;
}
