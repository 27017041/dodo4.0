import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import { DataTableDirective } from 'angular-datatables';
import {CompanyApi, Company} from "./company";
import {DatatableService} from "../../datatable/datatable.service";
import {CompanyService} from "./company.service";

@Component({
    selector: 'my-company',
    templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    pageType:string;
    dtOptions: any;
    companyData:Company;//详情页面数据
    openId:number;//打开详情界面的keyid,用于判断删除数据的时候，被删的数据是否打开着
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('searchForm') searchForm:NgForm;

    hasDtInstance:boolean = false;//防止table多次实例化
    isDisplay:boolean = false;//默认不显示其它tabs
    isBtnDelete:boolean = true;
    selectedIndex:number = 0;
    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }
    company = new Company();

    constructor(
        private dt:DatatableService,
        private label:LabelService,
        private util:UtilService,
        private cs:CompanyService
    ) { }

    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }
    onIndexChange(index:number){
        this.selectedIndex = index;
    }

    getLabel() {
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('company', this);
    }

    getAuth(){
        this.util.getAuth('company',this);
    }

    onSearch(){
        this.dt.onSearch(this);
    }

    onAdd(){
        if(!this.isDisplay){this.isDisplay = true;}
        this.selectedIndex = 1;
        this.pageType = "add";
        this.companyData = undefined;
    }

    onDetail(keyId){
        if(this.auth.rightUpdate){
            this.openId = keyId;
            this.cs.getDetail(this.openId,this);
        }
    }

    onDelete(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            const selectData = dtInstance.rows('.selected').data();
            this.cs.prepareDelete(selectData,this);
        });
    }

    setGrid(){
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:true, //是否含有选择框
                hasLink:true,//是否含有连接
                ajax:{
                    url:CompanyApi.searchData, // url
                    data:this.company // data, 会把对象处理成字符串
                },
                columns:[
                    {isSelect:true}, // isSelect 配置checkbox
                    {isLink:true,keyField:"companyId",data:"companyName",name:"companyName"},
                    {data:"companyEmail",name:"companyEmail"},
                    {data:"companyPhone",name:"companyPhone"}
                ]
            },
            this  //当前的component
        )
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter"){
            this.onSearch();
        }
    }

    onReset(){
        this.searchForm.onReset();
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

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.setGrid();
    }

}