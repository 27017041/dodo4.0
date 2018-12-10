/**
 * Created by Leo on 2017/11/28.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators  } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {LogService} from "../../util/log.service";
import {ModuleService} from "./module.service";
import {RelationalItem, Relational} from "../../tools/module-config/module-config";
import {ModuleRelationalService} from "../../datatable/datatable-relational.service";
import {API} from "../../config";
import {FormField} from "./module";

@Component({
    selector: 'my-module-form',
    templateUrl: './module-form.component.html'
})
export class ModuleFormComponent implements OnInit {
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() keyId:any;
    @Input() formFieldList:any;
    @Input() moduleForm:FormGroup;
    @Input() optionList:Array<any>;
    @Input() moduleData:any;
    @Input() moduleName:string;
    @Output() onReload = new EventEmitter<boolean>();
    @Output() onLinkRelation= new EventEmitter<any>();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective; // 表格实例

    oldModuleData:any;
    dtOptionsList:any;
    linkageModuleList:Array<any> = new Array();
    relationalLabelList:Array<any> = new Array();
    relationalList:Array<Relational> = new Array();
    relationalItemList:Array<RelationalItem> = new Array();
    relationalFieldList:Array<RelationalItem> = new Array();
    relationalFormList:Array<FormField> = new Array();


    constructor(
        private log:LogService,
        private ms:ModuleService,
        private dt:ModuleRelationalService
    ) { }

    getLinkage(){
        for(let f of this.formFieldList){
            if(f.fieldType == "linkage"){
                this.ms.getLinkageModuleList(f,this);
            }
        }
    }

    getRelational(){
        const moduleName = this.moduleName;
        this.ms.getRelational(this,moduleName);
    }

    onReset(){
        if(this.pageType == "add"){
            this.moduleForm.reset();
        }else if(this.pageType == "detail"){
            this.moduleForm.reset(this.oldModuleData );
        }
    }

    onSave(moduleForm){
        const fb = this.onPrepareSave();
        if(this.pageType == "add"){
            this.ms.onSave(fb,this);
        }else if(this.pageType == "detail"){
            this.ms.onUpdate(fb,this);
        }
    }

    onPrepareSave(){
        let fb:any = {};
        let mb = Object.assign({},this.moduleForm.value);
        fb.changeFields = this.ms.setLogData(this);
        //fb.changeFields = this.log.setLogData(this.moduleForm.value,this.oldModuleData,this.moduleLabel["text"]);
        for(let ff of this.formFieldList){
            if(ff.isDisplay == 29 && ff.fieldType == "multiselect"){
                mb[ff.fieldLabel] = mb[ff.fieldLabel].toString();
            }
        }
        fb.formData = JSON.stringify(mb);
        return fb;
    }

    onLick(data:any){
        let d = data;
        d.relationalFormList = this.relationalFormList[data.relationalName];
        this.onLinkRelation.emit(d);
    }

    onLinkDelete(data:any){
        this.ms.onLinkDelete(data,this)
    }

    onLinkHistory(data:any){
        console.log(data)
    }

    onLinkage(){
        this.ms.openLinkageDialog(this);
    }

    setGrid(fieldList:any){
        for(let f = 0; f<fieldList.length; f++){
            console.log(fieldList)
            this.dtOptionsList[f] = this.dt.setGrid(
                {
                    hasSelect:false,
                    hasLink:true,
                    hasDelete:fieldList[f][0].isDelete==1?true:false,
                    hasHistory:fieldList[f][0].isHistory==1?true:false,
                    ajax : {url:API.api +"/relational/getRelational",data:{moduleName:fieldList[f][0].moduleName,relationalName:fieldList[f][0].relationalName}},
                    relationalFields:fieldList[f]
                },
                this
            )
        }
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['moduleData']){
            if(changes['moduleData'].currentValue){
                this.moduleForm.setValue(changes['moduleData'].currentValue);
                this.getRelational();
            }
        }
        this.oldModuleData = Object.assign({}, this.moduleData);
    }

    ngOnInit() {
        this.getLinkage();
    }

}