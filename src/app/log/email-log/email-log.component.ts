/**
 * Created by Carson on 2018/5/10.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {DatatableService} from "../../datatable/datatable.service";
import {EmailLogApi, EmailLog} from "./email-log";


@Component({
    selector: 'my-email-log',
    templateUrl: './email-log.component.html'
})
export class EmailLogComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;//required
    @ViewChild('searchForm') searchForm:NgForm;//required

    globalLabel:any;//required
    moduleLabel:any;//required
    keyId:number;//required
    dtOptions:any;//required

    selectedIndex:number = 0;//required
    hasDtInstance:boolean = false;//required
    isBtnDelete:boolean = true;//required
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };//required
    tabList:Array<any> = new Array();//required
    searchData:EmailLog = new EmailLog();//required

    statusList:any[];
    logTypeList:any[];

    constructor(
        private label:LabelService,
        private util:UtilService,
        private dt:DatatableService
    ) {
    }

    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }
    onIndexChange(index:number){
        this.selectedIndex = index;
    }

    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('emailLog',this);
    }

    getAuth(){
        this.util.getAuth('emailLog',this);
    }

    getSelectList(){
        this.util.getSelectList(16,"logTypeList",this);
        this.util.getSelectList(17,"statusList",this);
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
        this.searchForm.onReset();
    }

    onDetail(keyId,keyName){
        if(this.auth.rightUpdate){
            this.keyId = keyId;
            let data = {
                type : "detail",
                name : keyName,
                id : keyId
            };
            this.onCreateTabs(data)
        }
    }

    onCreateTabs(data:any){
        let isSame:boolean = false;
        let index:number;
        let currentData:any;
        for(let t = 0; t< this.tabList.length; t++){
            if(data.name == this.tabList[t].name && data.id ==  this.tabList[t].id){
                isSame = true;
                index = t + 1;
            }
        }
        if(!isSame){
            this.tabList.push(data)
            index = this.tabList.length + 1;
        }

        this.selectedIndex = index;
    }

    onClear(index:number){
        this.tabList.splice(index,1);
    }

    onReload(reload: boolean) {
        if(reload){
            this.onSearch();
        }
    }


    setGrid(){
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:false,
                hasLink:true,
                ajax:{
                    url:EmailLogApi.getList,
                    data:this.searchData
                },
                columns:[
                    {isLink:true,keyField:"mailId",data:"mailSubject",name:"mailSubject"},
                    {data:"mailFrom",name:"mailFrom"},
                    {data:"mailTo",name:"mailTo"},
                    {data:"sendDate",name:"sendDate",fieldType:'date',format:'YYYY/MM/DD'},
                    {data:"status",name:"status"}
                ]
            },
            this
        )

    }

    onChange(date){
        // this.sendMessageLogForm.controls['dateFrom'].setValue(moment(date.value).format('YYYY-MM-DD'))
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getSelectList();
        this.setGrid();
    }

}