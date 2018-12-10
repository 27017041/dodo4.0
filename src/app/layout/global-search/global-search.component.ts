/**
 * Created by Leo on 2017/11/23.
 */
import {Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit} from '@angular/core';
import {ActivatedRoute,Params} from '@angular/router'
import {NgForm} from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {GlobalSearch, globalSearchApi, GlobalSearchModule, GlobalSearchParam} from "./global-search";
import {GlobalSearchService} from "./global-search.service";
import {DatatableService} from "../../datatable/datatable.service";


@Component({
    selector: 'global-search',
    templateUrl: './global-search.component.html'
})
export class GlobalSearchComponent implements OnInit,AfterViewInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;//required
    @ViewChild('searchForm') searchForm:NgForm;//required

    gobalLabel:any;//required
    moduleLabel:any;//required
    keyId:number;//required
    dtOptions:any;//required

    selectedIndex:number = 0;//required
    hasDtInstance:boolean = false;//required
    isBtnDelete:boolean = true;//required
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };//required
    tabList:Array<any> = new Array();//required

    searchData:GlobalSearchParam = new GlobalSearchParam();//required
    moduleList:GlobalSearchModule[];
    relationalLabel:any;

    constructor(
        private route: ActivatedRoute,
        private dt:DatatableService,
        private label:LabelService,
        private util:UtilService,
        private gs:GlobalSearchService
    ) {}

    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }

    onIndexChange(index: number) {
        this.selectedIndex = index;
    }

    getLabel() {
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('globaSearch', this);
    }

    getAuth() {
        this.util.getAuth('globaSearch', this);
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter"){
            this.onSearch();
        }
    }

    onSearch() {
        this.dt.onSearch(this);
    }


    onDetail(keyId,keyName,type?:string){
        if(this.auth.rightUpdate){
            this.keyId = keyId;
            let data = {
                type : type?type:"",
                pageType : "detail",
                name : keyName,
                id : keyId
            };

            this.gs.getRelationalLabel(type,this);
            this.onCreateTabs(data);
        }
    }

    onCreateTabs(data:any){
        let isSame:boolean = false;
        let index:number;
        let currentData:any;
        for(let t = 0; t< this.tabList.length; t++){
            if(data.name == this.tabList[t].name && data.id == this.tabList[t].id){
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

    getObjModules(){
        this.route.params.subscribe((params:Params)=>{
            this.searchData.keyword = params.keyword;
            this.gs.getObjModules(this);
        });
    }

    getObjsList(item){
        this.searchData.objTypeId = item.objTypeId;
        this.searchData.objTitleTitle = item.objTitleTitle;
        this.dt.onSearch(this);
    }

    onReload(reload:boolean){
        if(reload){
            if(this.dtElement){
                this.onSearch();
            }
        }
    }

    setGrid(){
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:false, //是否含有选择框
                hasLink:true,//是否含有连接
                ajax:{
                    url:globalSearchApi.getObjsList, // url
                    data:this.searchData // data, 会把对象处理成字符串
                },
                columns:[
                    {isLink:true,keyField:"objId",data:"objTitle",name:"objTitle"},
                    {data:"keyword",name:"keyword"},
                    {data:"objTypeName",name:"objTypeName"},
                    {data:"createDate",name:"createDate",fieldType:"date", format:"YYYY-MM-DD"},
                    {data:"loginName",name:"loginName"}
                ]
            },
            this  //当前的component
        )
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
    }

    ngAfterViewInit(){
        this.getObjModules();
    }
}