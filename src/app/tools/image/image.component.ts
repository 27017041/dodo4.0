/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UtilService} from "../../util/util.service";
import {LabelService} from "../../util/label.service";
import {ImageSetting, Watermark} from "./image";
import {ImageService} from "./image.service";

@Component({
    selector: 'my-image',
    templateUrl: './image.component.html',
    styleUrls:['./image.component.css']
})
export class ImageComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    settingList:Array<ImageSetting>;
    waterImg: File;
    previewUrl:string;
    @ViewChild('waterForm') waterForm:NgForm;

    minValue:number = 1;
    maxValue:number = 100;
    isDelBtn:boolean = false;
    selcetSettingArr:Array<number> = new Array();
    wmTypeList:Array<any> = new Array();
    wmPositionList:Array<any> = new Array();
    wmScaleList:Array<any> = new Array();
    wmFontList:Array<any> = new Array();
    wmColorList:Array<any> = new Array();
    watermark:Watermark = new Watermark();
    oldWatermark:Watermark = new Watermark();
    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }

    constructor(
        private label:LabelService,
        private util:UtilService,
        private is:ImageService
    ) { }


    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('image',this);
    }

    getAuth(){
        this.util.getAuth('image',this);
    }

    getSelectList(){
        this.util.getSelectList(10,'wmTypeList',this);
        this.util.getSelectList(11,'wmPositionList',this);
        this.util.getSelectList(12,'wmScaleList',this);
        this.util.getSelectList(13,'wmFontList',this);
        this.util.getSelectList(14,'wmColorList',this);
    }

    getSettingList(){
        this.is.getSettingList(this);
    }

    onItemChange(e,item){
        if(e.checked){
            this.selcetSettingArr.push(item.confId);
        }else{
            this.util.delArrVal( this.selcetSettingArr,item.confId);
        }
        if(this.selcetSettingArr.length == 0){
            this.isDelBtn = false;
        }else{
            this.isDelBtn = true;
        }
    }

    onAdd(){
        this.is.onAdd(this);
    }

    onDetail(data){
        console.log(data)
        this.is.onDetail(data,this);
    }

    onDelete(){
        this.is.prepareDel(this)
    }

    getWatermark(){
        this.is.getWatermark(this);
    }

    onSelectImage(url){
        this.watermark.url = url;
    }

    onPreview(){
       this.is.onPreview(this);
    }

    onSaveWatermark(){
        this.is.saveWatermarkSetting(this);
    }

    onReset(){
        this.waterForm.reset(this.oldWatermark);
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getSelectList();
        this.getSettingList();
        this.getWatermark();
    }

}