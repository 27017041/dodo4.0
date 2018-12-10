/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ModuleConfigService} from "./module-config.service";
import {ModuleConfig, ModuleField, ConfLabel} from "./module-config";
import {LogService} from "../../util/log.service";
import {APPCONFIG} from "../../config";
import {UtilService} from "../../util/util.service";

@Component({
    selector: 'my-module-field-config',
    templateUrl: './module-field-config.component.html',
    styleUrls: ['./module-config.component.css']
})
export class ModuleFieldConfigComponent implements OnInit{
    @Input() fieldPageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() moduleName:string;
    @Input() fieldData:ModuleField;
    @Input() moduleList:any;
    @Input() labelTypeList:any;
    @Input() selectOptionList:any;
    @Input() labelOriginalList:any;
    @Input() displayList:any;
    @Input() disabledList:any;
    @Input() readonlyList:any;
    @Input() linkageList:any;
    @Output() onReload = new EventEmitter<boolean>();
    @ViewChild('fieldAddForm') fieldAddForm:NgForm;
    @ViewChild('fieldDetailForm') fieldDetailForm:NgForm;

    oldFieldData:ModuleField;
    oldLinkage:Array<string> = new Array();

    typeList = ["text","select","multiselect","autocomplete","date","textarea","linkage"];
    validationList = ["required","email","min","max","min_length","max_length"];
    lang = APPCONFIG.language;

    constructor(
        private log:LogService,
        private mcs:ModuleConfigService,
        private util:UtilService
    ) { }

    onReset(){
        if(this.fieldPageType == "add"){
            this.fieldAddForm.onReset();
        }else if(this.fieldPageType == "detail"){
            this.fieldDetailForm.reset(this.oldFieldData );

            setTimeout(()=>{
                // 恢复多选的值
                this.fieldData.validation = this.oldFieldData.validation;
            },1)
        }
    }

    onAdd(){
        const fb = this.onPrepare("add");
        this.mcs.onAddField(fb,this);
    }

    onUpdate(){
        const fb = this.onPrepare();
        this.mcs.onUpdateField(fb,this);
    }

    onPrepare(type?:string){
        let fb:any = {};
        let fdata:any = Object.assign({},this.fieldData);
        if(type == "add"){
            let ldata:Array<ConfLabel> = [
                {labelText:fdata.labelTextCn,lang:"cn",module:this.moduleName,labelOrginal:fdata.fieldLabel,labelType:fdata.labelType},
                {labelText:fdata.labelTextTc,lang:"tc",module:this.moduleName,labelOrginal:fdata.fieldLabel,labelType:fdata.labelType},
                {labelText:fdata.labelTextEn,lang:"en",module:this.moduleName,labelOrginal:fdata.fieldLabel,labelType:fdata.labelType}
            ];
            fb.confLabelData = JSON.stringify(ldata);
            delete fdata.labelTextCn;
            delete fdata.labelTextTc;
            delete fdata.labelTextEn;
        }
        if(fdata.validation){
            let vlist = Object.assign({},this.validationList);
            for(let v in vlist){
                if(!this.onContain(vlist[v],fdata.validation)){//如果没有被选择，就删掉对应的value字段
                    if(vlist[v] == "min"){
                        delete fdata.minValue;
                    }else if(vlist[v] == "max"){
                        delete fdata.maxValue;
                    }else if(vlist[v] == "min_length"){
                        delete fdata.minLengthValue;
                    }else if(vlist[v] == "max_length"){
                        delete fdata.maxLengthValue;
                    }
                }
            }
            if( fdata.validation != ""){
                fdata.validation = fdata.validation.toString();
            }else{
                delete fdata.validation;
            }
        }
        if(fdata.linkageModule){
            fdata.linkageModule = fdata.linkageModule.toString();
        }
        //fb.changeFields = this.log.setLogData(this.fieldData,this.oldFieldData,this.moduleLabel["text"]);
        fb.fieldData = JSON.stringify(fdata);
        return fb;
    }

    onChangeFieldType(fieldData){
        if(fieldData.fieldType == "text"){
            this.validationList = ["required","email","min","max","min_length","max_length"];
            delete fieldData.selectTypeId;
            delete fieldData.validation;
        }else if(fieldData.fieldType == "select" || fieldData.fieldType == "autocomplete" || fieldData.fieldType == "multiselect"){
            this.validationList = ["required"];
            delete fieldData.validation;
            delete fieldData.minValue;
            delete fieldData.maxValue;
            delete fieldData.minLengthValue;
            delete fieldData.maxLengthValue;
            delete fieldData.pattern;
        }else if(fieldData.fieldType == "date"){
            this.validationList = ["required"];
            delete fieldData.validation;
            delete fieldData.minLengthValue;
            delete fieldData.maxLengthValue;
            delete fieldData.minValue;
            delete fieldData.maxValue;
            delete fieldData.selectTypeId;
            delete fieldData.pattern;
        }else if(fieldData.fieldType == "textarea"){
            this.validationList = ["required","min_length","max_length"];
            delete fieldData.selectTypeId;
            delete fieldData.validation;
            delete fieldData.minValue;
            delete fieldData.maxValue;
        }else if(fieldData.fieldType == "linkage"){
            if(fieldData.linkageModule){
                this.fieldData.linkageModule = fieldData.linkageModule.split(",");
            }
        }
    }

    onContain(value, array){
        if($.inArray(value, array) > -1){
            return true;
        }else{
            return false;
        }
    }

    linkageModuleChange(e){
        const value = e.value;
        if(this.oldLinkage.length == 0){
            this.oldLinkage =value;
        }else{
            if(value.length > this.oldLinkage.length){
                //增加
                const value2 = Object.assign([],e.value);
                for(let item of value){
                    for(let item2 of this.oldLinkage){
                        if(item == item2){
                           this.util.delArrVal(value2,item);

                        }
                    }
                }
                this.oldLinkage.push(value2[0]);
            }else{
                //减少
                const value2 = Object.assign([],this.oldLinkage);
                for(let item of this.oldLinkage){
                    for(let item2 of value){
                        if(item == item2){
                            this.util.delArrVal(value2,item);
                        }
                    }
                }
                this.util.delArrVal(this.oldLinkage,value2[0]);
            }
        }
        this.fieldData.linkageModule = this.oldLinkage;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['fieldData']){
            if(changes['fieldData'].currentValue){
                this.fieldData = changes['fieldData'].currentValue;
                this.onChangeFieldType(this.fieldData);
            }else{
                this.fieldData = new ModuleField();
                this.fieldData.moduleName = this.moduleName;
            }
        }else{
            this.fieldData = new ModuleField();
            this.fieldData.moduleName = this.moduleName;
        }
        this.oldFieldData = Object.assign({}, this.fieldData);
    }

    ngOnInit(){

    }

}