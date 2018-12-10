/**
 * Created by Carson on 2018/5/23.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter,  ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';

import {LogService} from "../../util/log.service";
import { DataTableDirective } from 'angular-datatables';

import {Quotation, QuotationApi} from "./quotation";
import {QuotationService} from "./quotation.service";
import {DatatableService} from "../../datatable/datatable.service";
import {DialogQuotationComponent} from "./dialog/dialog-quotation.component"
import * as moment from 'moment';
import {UtilService} from "../../util/util.service";
import {Relational, RelationalItem} from "../../tools/module-config/module-config";
import {FormField} from "../module/module";
import {ModuleRelationalService} from "../../datatable/datatable-relational.service";
import {API} from "../../config";

@Component({
    selector: 'my-quotation-form',
    templateUrl: './quotation-form.component.html'
})
export class QuotationFormComponent implements OnInit {
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    //@Input() roleList:any;
    @Input() keyId:any;
    @Output() onReload = new EventEmitter<boolean>();

    @ViewChild('quotationForm') quotationForm: NgForm;
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    qItemDtOptions:any;
    quotationData:Quotation;
    oldQuotationData:Quotation;
    currencyList:any;
    clientOList:any;
    contactOList:any;
    @Input() relationalData:any;
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };
    linkageModuleList:Array<any> = new Array();
    dtOptionsList:any;
    relationalLabelList:Array<any> = new Array();
    relationalList:Array<Relational> = new Array();
    relationalItemList:Array<RelationalItem> = new Array();
    relationalFieldList:Array<RelationalItem> = new Array();
    relationalFormList:Array<FormField> = new Array();

    linkageFieldList = {
        "linkageModule":"company,client,contact",
        "linkageViews":"v_obj_company,v_obj_client,v_obj_contact",
        "linkageKey":"companyId,clientId,contactId"
    }

    constructor(
        private log:LogService,
        private qs:QuotationService,
        private dt:DatatableService,
        private dialog:MatDialog,
        private util:UtilService,
        private rdt:ModuleRelationalService
    ) { }

    onReset(){
        if(this.pageType == "add"){
            this.quotationForm.onReset();
        }else if(this.pageType == "detail"){
            this.quotationForm.reset(this.oldQuotationData );
        }
    }

    onDetail(){
        this.qs.getDetail(this.keyId,this)
    }

    onSave(){
        const fb = this.onPrepareSave();
        this.qs.onSave(fb,this);
    }

    onChange(){
        const fb = this.onPrepareSave();
        this.qs.onChange(fb,this);
    }

    onPrepareSave(){
        let fb:any = {};
        let ud:Quotation = Object.assign({},this.quotationData);
        let fields = new Quotation().getField();
        fb.changeFields = this.log.setLog(fields,this.quotationData,this.oldQuotationData,this.moduleLabel["text"]);
        fb.formData = JSON.stringify(ud);
        return fb;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        //quotation 模块访问的 add
        if(changes['pageType']){
            if(changes['pageType'].currentValue == "add"){
                this.quotationData = new Quotation();
                this.oldQuotationData = Object.assign({}, this.quotationData);
                this.onReset();
            }
        }

        //quotation 模块访问的 detail
        if(changes['keyId']){
            if(changes['keyId'].currentValue){
                this.keyId = changes['keyId'].currentValue;
                this.qs.getRelational(this);
                this.onDetail();
            }
        }

        //关联时访问的
        if(changes['relationalData']){
            if(changes['relationalData'].currentValue){
                //this.relationalData = changes['relationalData'].currentValue;
                this.keyId = this.relationalData.tableKey;
                this.setQuotationItemGrid();
                this.onDetail();
            }
        }

    }

    onAddItem(){
        const dialogRef = this.dialog.open( DialogQuotationComponent, {
            data: {
                globalLabel: this.globalLabel,
                moduleLabel: this.moduleLabel,
                page:'quoItem',
                pageType: 'add'
            }
        });
    }

    setQuotationItemGrid(){
       /* console.log(this.keyId)
        this.qItemDtOptions = this.dt.setGrid(
            {
                hasSelect:true,
                hasLink:true,
                ajax:{
                    url:QuotationApi.getQuotationItemList,
                    data:{parentId:this.keyId},
                    moduleName:"quotationItem"
                },
                columns:[
                    {isSelect:true},
                    {isLink:true,keyField:"titleId",data:"title",name:"title"},
                    {data:"unitPrice",name:"unitPrice",fieldType:'currency'},
                    {data:"unitCost",name:"unitCost"},
                    {data:"qty",name:"qty"},
                    {data:"disc%",name:"disc%"},
                    {data:"discount",name:"discount",fieldType:'currency'},
                    {data:"subTotal",name:"subTotal",fieldType:'currency'},
                    {data:"supplier",name:"supplier"},
                    {data:"EuShipDate",name:"EuShipDate",fieldType:'date',format:'YYYY-MM-DD'},
                    {data:"officeShipDate",name:"officeShipDate",fieldType:'date',format:'YYYY-MM-DD'}
                ]
            },
            this
        )*/

        let opt = {
            hasSelect:true,
            hasLink:true,
            ajax:{
                url:QuotationApi.getQuotationItemList,
                data:{parentId:this.keyId},
                moduleName:"quotationItem"
            },
            columns:[
                {isSelect:true},
                {isLink:true,keyField:"titleId",data:"title",name:"title"},
                {data:"unitPrice",name:"unitPrice",fieldType:'currency'},
                {data:"unitCost",name:"unitCost"},
                {data:"qty",name:"qty"},
                {data:"disc%",name:"disc%"},
                {data:"discount",name:"discount",fieldType:'currency'},
                {data:"subTotal",name:"subTotal",fieldType:'currency'},
                {data:"supplier",name:"supplier"},
                {data:"EuShipDate",name:"EuShipDate",fieldType:'date',format:'YYYY-MM-DD'},
                {data:"officeShipDate",name:"officeShipDate",fieldType:'date',format:'YYYY-MM-DD'}
            ]
        }
        if(this.qItemDtOptions){
            this.dt.reloadRMGSubject.next(opt);
        }else{
            this.qItemDtOptions = this.dt.setGrid(opt,this)
        }


    }

    checkObjEmpty(val){
       return this.util.isEmptyObj(val);
    }

    setRelationalGrid(fieldList:any){
        for(let f = 0; f<fieldList.length; f++){
            this.dtOptionsList[f] = this.rdt.setGrid(
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

    onLinkage(){
        this.qs.openLinkageDialog(this);
    }

    ngOnInit() {

        this.util.getAuth('quotation',this);
        this.qs.getCurrency(this);
        //this.qs.getClientOList(this);
        //this.qs.getContactOList(this);
        this.qs.getLinkageModuleList(this);



    }

}