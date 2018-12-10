/**
 * Created by Carson on 2018/5/10.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {TaskLogService} from "./task-log.service";
import {TaskLog, TaskLogApi} from "./task-log";
import {DatatableService} from "../../datatable/datatable.service";


@Component({
    selector: 'task-log',
    templateUrl: './task-log.component.html'
})
export class TaskLogComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;//页面类型
    openId:number;//打开详情界面的keyid,用于判断删除数据的时候，被删的数据是否打开着
    statusList:any;
    frequencySelect:any;
    dtOptions:any;
    taskLogData:TaskLog;//详情页面数据

    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };
    taskLog = new TaskLog();

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('taskLogForm') taskLogForm:NgForm;

    constructor(
        private label:LabelService,
        private util:UtilService,
        private us:TaskLogService,
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
        this.label.getModuleLabel('taskLog',this);
    }

    getAuth(){
        this.util.getAuth('taskLog',this);
    }

    getSelectList(){
        this.util.getSelectList(18,"frequencySelect",this);
        this.util.getSelectList(19,"statusList",this);
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
        this.taskLogForm.onReset();
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
                order:[['0','asc']],
                ajax:{
                    url:TaskLogApi.getList,
                    data:this.taskLog
                },
                columns:[
                    {isLink:true,keyField:"cronLogId",data:"cronName",name:"cronName"},
                    {data:"frequency",name:"frequency"},
                    {data:"status",name:"status"},
                    // {data:"log",name:"log"},
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