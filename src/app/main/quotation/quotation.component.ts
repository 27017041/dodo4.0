/**
 * Created by Carson on 2018/5/21.
 */

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {QuotationService} from "./quotation.service";
import {Quotation, QuotationApi} from "./quotation";
import {DatatableService} from "../../datatable/datatable.service";

@Component({
    selector: 'my-quotation',
    templateUrl: './quotation.component.html'
})
export class QuotationComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;//页面类型
    openId:number;//打开详情界面的keyid,用于判断删除数据的时候，被删的数据是否打开着
    //roleList:any;
    //clientOList:any = [{clientId:1,clientName:'carson'},{client:2,clientName:'leo'}];
    //contactOList:any;
    //currencyList:any;
    dtOptions:any;
    quotationData:Quotation;//详情页面数据

    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete
    isBtnSetClient:boolean = true;
    isBtnSetContact:boolean = true;
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };
    quotation = new Quotation();
    url = 'quotationList';

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('quotationForm') quotationForm:NgForm;

    constructor(
        private label:LabelService,
        private util:UtilService,
        private qs:QuotationService,
        private dt:DatatableService
    ) { }

    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }
    onIndexChange(index:number){
        this.selectedIndex = index;
    }

    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('quotation',this);
    }

    getAuth(){
        this.util.getAuth('quotation',this);
    }

    getSelectList(){
        this.qs.getClientOList(this);
        this.qs.getContactOList(this);
        this.qs.getCurrency(this);
        this.util.getSelectList(3,"clientList",this);
        this.qs.getRoleList(this);
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter"){
            this.onSearch();
        }
    }

    onSearch(){
        this.dt.onSearch(this);
    }

    onReset(){
        this.quotationForm.onReset();
    }

    onAdd(){
        if(!this.isDisplay){this.isDisplay = true;}
        this.selectedIndex = 1;
        this.pageType = "add";
        this.openId = undefined;
    }

    onDelete(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            const selectData = dtInstance.rows('.selected').data();
            this.qs.prepareDelete(selectData,this)
        });
    }

    onDetail(keyId){
        if(this.auth.rightUpdate){
            this.openId = keyId;
            if(!this.isDisplay){this.isDisplay = true;}
            this.selectedIndex = 1;
            this.pageType = "detail";
            //this.qs.getDetail(this.openId,this)
        }
    }

    onReload(reload:boolean){
        if(reload){
            if(this.dtElement){
                this.onSearch();
                if(this.pageType == "add"){
                    this.selectedIndex = 0;
                    this.isDisplay = false;
                }else if(this.pageType == "detail"){
                    this.onDetail(this.openId);
                }
            }
        }
    }

    setGrid(){
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:true,
                hasLink:true,
                ajax:{
                    url:QuotationApi.getList,
                    data:this.quotation
                },
                columns:[
                    {isSelect:true},
                    {isLink:true,keyField:"quotationId",data:"quotationNo",name:"quotationNo"},
                    {data:"title",name:"title"},
                    {data:"clientName",name:"clientId"},
                    {data:"contactName",name:"contactId"},
                    {data:"createDate",name:"createDate",fieldType:'date',format:'YYYY-MM-DD'},
                    {data:"totalCost",name:"totalCost",fieldType:'currency'},
                    {data:"statusName",name:"status"}
                ]
            },
            this
        )

    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getSelectList();
        this.setGrid();
    }

}