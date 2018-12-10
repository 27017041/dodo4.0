/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {SchedulerApi, Scheduler} from "./scheduler";
import {SchedulerService} from "./scheduler.service";
import {DatatableService} from "../../datatable/datatable.service";

@Component({
    selector: 'my-scheduler',
    templateUrl: './scheduler.component.html'
})
export class SchedulerComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;
    openId:number;
    searchData:Scheduler = new Scheduler();
    schedulerData:Scheduler;

    @ViewChild(DataTableDirective) dtElement: DataTableDirective; // 表格实例
    dtOptions: any;// 表格的配置
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete
    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }

    constructor(
        private dt:DatatableService,
        private label:LabelService,
        private util:UtilService,
        private ss:SchedulerService
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
        this.label.getModuleLabel('scheduler',this);
    }

    getAuth(){
        this.util.getAuth('scheduler',this);
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

    onAdd(){
        if(!this.isDisplay){this.isDisplay = true;}
        this.selectedIndex = 1;
        this.pageType = "add";
    }

    onDelete(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            const selectData = dtInstance.rows('.selected').data();
            this.ss.prepareDelete(selectData,this)
        });
    }

    onDetail(keyId){
        if(this.auth.rightUpdate){
            this.openId = keyId;
            this.ss.getDetail(this.openId,this)
        }
    }

    onReload(reload:boolean){
        if(reload){
            if(this.dtElement){
                this.onSearch();
                if(this.pageType == "add"){
                    this.selectedIndex = 0;
                    this.isDisplay = false;
                }else{
                    this.onDetail(this.openId)
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
                    url:SchedulerApi.getCronList,
                    data:this.searchData
                },
                columns:[
                    {isSelect:true},
                    {isLink:true,keyField:"cronId",data:"cronName",name:"cronName"},
                    {data:"monthDay",name:"monthDay",textOverflow:true},
                    {data:"weekDay",name:"weekDay"},
                    {data:"hourDay",name:"hourDay",textOverflow:true},
                    {data:"minuteHour",name:"minuteHour",textOverflow:true}
                ]
            },
            this
        )

    }


    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.setGrid();
    }

}