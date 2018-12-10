/**
 * Created by Carson on 2018/5/16.
 */

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {AllCronLogService} from "./all-cron-log.service";
import {AllCronLog, AllCronLogApi} from "./all-cron-log";
import {DatatableService} from "../../datatable/datatable.service";
import * as moment from 'moment';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'all-cron-log',
    templateUrl: './all-cron-log.component.html'
})
export class AllCronLogComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;//页面类型
    openId:number;//打开详情界面的keyid,用于判断删除数据的时候，被删的数据是否打开着
    statusList:any;
    logType:any;
    dtOptions:any;
    allCronLogData:AllCronLog;//详情页面数据

    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };
    allCronLog = new AllCronLog();

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('allCronLogForm') allCronLogForm:NgForm;


    constructor(
        private label:LabelService,
        private util:UtilService,
        private us:AllCronLogService,
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
        this.label.getModuleLabel('allCronLog',this);
    }

    getAuth(){
        this.util.getAuth('emailLog',this);
    }

    getSelectList(){
        this.util.getSelectList(16,"logType",this);
        this.util.getSelectList(17,"statusList",this);
        // this.us.getRoleList(this);
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter"){
            this.onSearch();
        }
    }

    onSearch(){
        console.log(this.allCronLog);
        this.dt.onSearch(this);
    }

    onReset(){
        this.allCronLogForm.onReset();
    }

    /*onDelete(){
     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
     const selectData = dtInstance.rows('.selected').data();
     this.us.prepareDelete(selectData,this)
     });
     }*/

    onDetail(keyId){
        if(this.auth.rightUpdate){
            this.openId = keyId;
            this.us.getDetail(this.openId,this)
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
                hasSelect:false,
                hasLink:true,
                ajax:{
                    url:AllCronLogApi.getList,
                    data:this.allCronLog
                },
                columns:[
                    {isLink:true,keyField:"cronId",data:"cronId",name:"cronId"},
                    {data:"cronName",name:"cronName"},
                    // {data:"mailTo",name:"mailTo"},
                    // {data:"sendDate",name:"sendDate",fieldType:'date',format:'YYYY/MM/DD'},
                    // {data:"status",name:"status"}
                ]
            },
            this
        )

    }

    onChange(date){
        // this.allCronLogForm.controls['dateFrom'].setValue(moment(date.value).format('YYYY-MM-DD'))
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getSelectList();
        this.setGrid();
    }

}
