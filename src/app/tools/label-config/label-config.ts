/**
 * Created by Leo on 2017/12/15.
 */
import {API} from "../../config";

export const LabelConfApi = {
    "getLabelTypeList" : API.api + "/conf/getRefOptionListByTypeId",
    "getLabelList" : API.api + "/conf/searchConfLabelByLabelType",
    "getLabelDetail" : API.api + "/conf/getConfLabelDetailList",
    "saveLabel" : API.api + "/conf/saveConfLabel",
    "updateLabel" : API.api + "/conf/updateConfLabel",
}

export class LabelType{
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

export class Label extends LabelType{
    labelId? : number;
    labelTextEn? : string;
    labelTextCn? : string;
    labelTextTc? : string;
    labelOrginal? : string;
    labelType? : number;
    module? : string;
}