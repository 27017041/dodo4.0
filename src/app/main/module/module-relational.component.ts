/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, FormArray, Validators  } from '@angular/forms';
import {ModuleService} from "./module.service";
import {FormField} from "./module";
import {LabelService} from "../../util/label.service";
import {Relational, RelationalItem} from "../../tools/module-config/module-config";
import {ModuleRelationalService} from "../../datatable/datatable-relational.service";
import {API} from "../../config";

@Component({
    selector: 'my-module-relational',
    templateUrl:'./module-relational.component.html'
})
export class ModuleRelationalComponent implements OnInit {
    @Input() relationalData: any;

    globalLabel:any;
    formFieldList:Array<FormField>;
    moduleForm:FormGroup
    moduleData:any;
    oldModuleData:any;

    keyId:any;
    dtOptionsList:any;
    linkageModuleList:Array<any> = new Array();
    relationalLabelList:Array<any> = new Array();
    relationalList:Array<Relational> = new Array();
    relationalItemList:Array<RelationalItem> = new Array();
    relationalFieldList:Array<RelationalItem> = new Array();
    relationalFormList:Array<FormField> = new Array();
    @Output() onLinkRelation= new EventEmitter<any>();

    constructor(
        private label:LabelService,
        private ms:ModuleService,
        private dt:ModuleRelationalService
    ){}


    getDetail(){
        this.formFieldList = this.relationalData.relationalFormList;
        this.moduleForm = this.ms.createForm(this.formFieldList,this);
        this.ms.getRelationalModuleDetail(this);
    }

    getRelational(){
        const moduleName = this.relationalData.relationalName;
        this.ms.getRelational(this,moduleName);
    }

    onReset(){
        this.moduleForm.reset(this.oldModuleData );
    }

    onSave(moduleForm){
        const fb = this.onPrepareSave();
        this.ms.onUpdateRMD(fb,this);
    }

    onPrepareSave(){
        let fb:any = {};
        let mb = Object.assign({},this.moduleForm.value);
        fb.changeFields = this.ms.setLogData(this);
        for(let ff of this.formFieldList){
            if(ff.isDisplay == 29 && ff.fieldType == "multiselect"){
                mb[ff.fieldLabel] = mb[ff.fieldLabel].toString();
            }
        }
        fb.formData = JSON.stringify(mb);
        return fb;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['relationalData']){
            if(changes['relationalData'].currentValue){
                this.relationalData = changes['relationalData'].currentValue;
                this.keyId = this.relationalData.tableKey;
                this.getDetail();
                this.getRelational();
            }
        }
    }

    onLick(data:any){
        let d = data;
        d.relationalFormList = this.relationalFormList[data.relationalName];
        this.onLinkRelation.emit(d);
    }

    setGrid(fieldList:any){
        for(let f = 0; f<fieldList.length; f++){
            this.dtOptionsList[f] = this.dt.setGrid(
                {
                    hasSelect:false,
                    hasLink:true,
                    ajax : {url:API.api +"/relational/getRelational",data:{moduleName:fieldList[f][0].moduleName,relationalName:fieldList[f][0].relationalName}},
                    relationalFields:fieldList[f]
                },
                this
            )
        }
    }

    getLinkage(){
        for(let f of this.formFieldList){
            if(f.fieldType == "linkage"){
                this.ms.getLinkageModuleList(f,this);
            }
        }
    }

    onLinkage(){
        this.ms.openLinkageDialog(this);
    }


    ngOnInit() {
        //this.getDetail();
        this.label.getGlobalLabel(this);
        this.getLinkage();
    }
}