/**
 * Created by Leo on 2017/11/23.
 */
import { ViewChild, Component, OnInit,HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {DatatableService} from "../../datatable/datatable.service";
import {LabelType, Label, LabelConfApi} from "./label-config";
import {APPCONFIG} from "../../config";
import {LabelConfigService} from "./label-config.service";

@Component({
    selector: 'my-label-config',
    templateUrl: './label-config.component.html'
})
export class LabelConfigComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;
    openId:number;
    selectType:Label = new Label();
    labelType:LabelType = new LabelType();
    labelTypeList:Array<LabelType>;// label type 列表
    labelDetailData : Label;

    @ViewChild('searchForm') searchForm:NgForm;
    @ViewChild(DataTableDirective) dtElement: DataTableDirective; // 表格实例
    dtOptions: any;// 表格的配置
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete
    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    isSearch:boolean = false;
    lang = APPCONFIG.language;
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
        private lcs:LabelConfigService
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
        this.label.getModuleLabel('labelConf',this);
    }

    getAuth(){
        this.util.getAuth('labelConf',this);
    }

    getLabelTypeList(){
        this.lcs.getLabelTypeList(this);
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter" && this.searchForm.form.valid){
            this.onSearch();
        }
    }


    onSearch(isRefresh:boolean=true){
        if(!this.isSearch){
            this.isSearch = true;
            this.setGrid();
        }else{
            this.dt.onSearch(this);
        }
        if(isRefresh){
            if(this.isDisplay){this.isDisplay = false;}
        }
    }

    onReset(searchForm){
        searchForm.reset({
            optionId:searchForm.value['optionId'],
            labelOrginal:undefined,
            labelText:undefined
        })
    }

    selectionChange(e){
        for(let item of this.labelTypeList){
            if(item.optionId == e.value){
                this.labelType = item;
            }
        }
    }

    onReload(reload:boolean){
        if(reload){
            if(this.dtElement){
                if(this.pageType == "add"){
                    this.onSearch();
                    this.selectedIndex = 0;
                    this.isDisplay = false;
                }else{
                    this.onSearch(false);
                    this.onDetail(this.openId);
                }
            }
        }
    }

    onAddLabel(){
        if(!this.isDisplay){this.isDisplay = true;}
        this.selectedIndex = 1;
        this.pageType = "add";
        this.labelDetailData = undefined;
    }

    onDetail(keyId){
        if(this.auth.rightUpdate){
            this.openId = keyId;
            // 传 keyId 给后台 获取数据
            this.lcs.onDetail(keyId,this);
        }
    }

    setGrid(){
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:false, //是否含有选择框
                hasLink:true,//是否含有连接
                order:[['0','asc']],
                iDisplayLength: 20,
                ajax:{
                    url:LabelConfApi.getLabelList,
                    data:this.selectType
                },
                columns:[
                    {data:"labelId",name:"labelId"},
                    {isLink:true,keyField:"labelOrginal",data:"labelText",name:"labelText"},
                    {data:"lang",name:"lang"},
                    {data:"labelOrginal",name:"labelOrginal"}
                ]
            },
            this  //当前的component
        )
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getLabelTypeList();
        this.setGrid();
    }

}