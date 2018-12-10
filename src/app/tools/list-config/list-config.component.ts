/**
 * Created by Leo on 2017/11/23.
 */
import { ViewChild, Component, OnInit, HostListener } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {ListConfigService} from "./list-config.service";
import {ListItem, ListItemOption, ListConfApi} from "./list-config";
import {APPCONFIG} from "../../config";
import {DatatableService} from "../../datatable/datatable.service";

@Component({
    selector: 'my-list-config',
    templateUrl: './list-config.component.html'
})
export class ListConfigComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;
    openId:number;
    itemList:Array<ListItem>;// item 列表
    moduleList:any;
    listItemOptData : ListItemOption; // 下拉的详情数据

    @ViewChild("searchForm") searchForm:NgForm;
    @ViewChild(DataTableDirective) dtElement: DataTableDirective; // 表格实例
    dtOptions: any;// 表格的配置
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete
    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    isSearch:boolean = false;
    selectItem:ListItem = new ListItem(); // 选择的下拉类型数据，用来search
    listItem:ListItem = new ListItem();//选择的下拉类型数据，用来Edit
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
        private lcs:ListConfigService
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
        this.label.getModuleLabel('listConf',this);
    }

    getAuth(){
        this.util.getAuth('listConf',this);
    }

    getListItem(){
        this.lcs.getListItem(this);
    }

    getModuleList(){
        this.lcs.getModuleList(this);
    }

    onAdd(){
        this.lcs.onAdd(this);
    }

    onEdit(){
        this.lcs.onEdit(this);
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

    selectionChange(e){
        for(let item of this.itemList){
            if(item.typeId == e.value){
                this.listItem = item;
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

    onAddOpt(){
        if(!this.isDisplay){this.isDisplay = true;}
        this.selectedIndex = 1;
        this.pageType = "add";
        this.listItemOptData = undefined;
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
                ajax:{
                    url:ListConfApi.getItemOpts,
                    data:this.selectItem
                },
                columns:[
                    {data:"optionId",name:"optionId"},
                    {isLink:true,keyField:"optionId",data:"optionNameCn",name:"optionNameCn"},
                    {data:"optionNameTc",name:"optionNameTc"},
                    {data:"optionNameEn",name:"optionNameEn"}
                ]
            },
            this  //当前的component
        )
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getModuleList();
        this.getListItem();
    }

}