/**
 * Created by Leo on 2018/1/18.
 */
import {API} from "../../config";

export const ImageApi = {
    "getSettingList": API.api + "/image/getConfImageTypeList",
    "addSetting": API.api + "/image/saveConfImageType",
    "updateSetting": API.api + "/image/updateConfImageType",
    "deleteSetting": API.api + "/image/deleteConfImageType",
    "uploadImage": API.api + "/image/uploadWaterMarkImage",
    "getWatermark": API.api + "/image/getWaterMark",
    "saveWatermark": API.api + "/image/saveWaterMark",
    "preview": API.api + "/image/preview",
}

export class ImageSetting{
    confId?:number;
    confName?:string;
    width?:number;
    height?:number;
    quality?:number;
}

export class Watermark{
    confId?:number;
    type?:string;
    position?:string;
    scaling?:string;
    size?:number;
    transparency?:number;
    url?:string;
    path?:string;
    text?:string;
    textFont?:string;
    textSize?:number;
    textColor?:string;
    textMargin?:number;
    textBgColor?:string;
}