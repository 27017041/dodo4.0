/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild, ElementRef, HostListener,ViewContainerRef,ComponentFactory,
    ComponentRef,ComponentFactoryResolver, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators  } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {ModuleService} from "./module.service";
import {FormField, GridField, SearchField, ModuleApi} from "./module";
import {API} from "../../config";
import {ModuleDatatableService} from "../../datatable/datatable-module.service";
import {ModuleRelationalComponent} from "./module-relational.component";



@Component({
    selector: 'my-module',
    templateUrl: './module.component.html'
})
export class ModuleComponent implements OnInit,OnDestroy  {
    dtOptions: any;// 表格的配置
    @ViewChild(DataTableDirective) dtElement: DataTableDirective; // 表格实例
    hasDtInstance:boolean = false;//防止table多次实例化
    isBtnDelete:boolean = true;//选择数据后才能delete

    moduleName:string;
    globalLabel:any;
    moduleLabel:any;

    searchForm:FormGroup;
    gridForm:FormGroup;
    moduleForm:FormGroup;

    searchFieldList:Array<SearchField>;
    gridFieldList:Array<GridField>;
    formFieldList:Array<FormField>;

    moduleData:any;
    pageType:string;
    isDisplay:boolean = false;//默认不显示其它tabs
    selectedIndex:number = 0;//tabs 切换
    optionList:Array<any> = new Array();
    openId:number|string;
    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }

    relationalContainerList = new Array();
    //componentRef: ComponentRef<ModuleRelationalComponent>;
    //@ViewChild("tabContainer", { read: ViewContainerRef }) container: ViewContainerRef;

    relationalLabel:any;//关联的模块的文本

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private resolver: ComponentFactoryResolver,
        private dt:ModuleDatatableService,
        private label:LabelService,
        private util:UtilService,
        private ms:ModuleService
    ) { }


    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }
    onIndexChange(index:number){
        this.selectedIndex = index;
    }

    setApi(){
        ModuleApi.getModule = API.api +"/"+ this.moduleName + "/getAllFieldByModule";
        ModuleApi.searchData = API.api +"/"+ this.moduleName + "/searchData";
        ModuleApi.saveData = API.api +"/"+ this.moduleName + "/saveData";
        ModuleApi.updateData = API.api +"/"+ this.moduleName + "/updateData";
        ModuleApi.getDetail = API.api +"/"+ this.moduleName + "/getDetail";
        ModuleApi.deleteData = API.api +"/"+ this.moduleName + "/deleteData";
    }

    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel(this.moduleName,this);

        let flag = true;
        this.label.moduleLabel$.subscribe((complete:string)=>{
            if(complete == this.moduleName && flag) {
                flag = false;
                this.getModuleConf();
            }
        })
    }

    getAuth(){
        this.util.getAuth(this.moduleName,this);
    }

    getModuleConf(){
        this.ms.getModuleConf(this);
    }

    getSelectList(){
        this.ms.getSelectList(this);
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
        this.moduleData = undefined;
        this.moduleForm.reset();
    }

    onDetail(keyId){
        this.moduleForm.reset();
        // 传 keyId 给后台 获取数据
        if(this.auth.rightUpdate){
            this.openId = keyId;
            this.ms.onDetail(keyId,this);
        }
    }

    onDelete(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            const selectData = dtInstance.rows('.selected').data();
            this.ms.prepareDelete(selectData,this)
        });
    }

    setGrid(){
        let columns:any = [{isSelect:true}];
        this.gridFieldList.forEach((grid,i) => {
            let visible = true;
            if(grid.isDisplay == 30){
                visible = false
            }
            if( i == 0 && visible){
                columns.push( {
                    isLink:true,
                    keyField:this.moduleName+"Id",
                    data:grid.fieldLabel,
                    name:grid.fieldLabel,
                    visible:visible
                })
            }else{
                columns.push( {data:grid.fieldLabel,name:grid.fieldLabel,visible:visible,fieldType:grid.fieldType})
            }
        })
        //this.searchData = this.searchForm.value;
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:true,
                hasLink:true,
                ajax:{
                    url:ModuleApi.searchData,
                    data:this.searchForm.value
                },
                columns:columns
            },
            this
        )
    }

    onReload(reload:boolean){
        if(reload){
            if(this.dtElement){
                this.onSearch();
                if(this.pageType == "add"){
                    this.selectedIndex = 0;
                    this.isDisplay = false;
                }
            }
        }
    }

    onLinkRelation(data:any){
        let isSame:boolean = false;
        let index:number;
        let currentData:any;
        for(let r = 0; r< this.relationalContainerList.length; r++){
            if(data.name == this.relationalContainerList[r].name && data.id ==  this.relationalContainerList[r].id){
                isSame = true;
                index = r + 2;
            }
        }
        if(!isSame){
            this.relationalContainerList.push(data)
            index = this.relationalContainerList.length + 1;
        }

        if(data.relationalName == "quotation"){
            this.ms.getCustomDetail(data,index,this);
            this.selectedIndex = index;
        }else{
            this.selectedIndex = index;
        }
        /*setTimeout(()=>{
            this.container.clear();
            const factory: ComponentFactory<ModuleRelationalComponent> = this.resolver.resolveComponentFactory(ModuleRelationalComponent);
            this.componentRef = this.container.createComponent(factory);
            this.componentRef.instance.relationalData = data;
        },100)*/
    }

    ngOnDestroy() {
        /*if(this.componentRef){
            this.componentRef.destroy()
        }*/
    }

    onClear(index:number){
        this.relationalContainerList.splice(index,1);
    }


    ngOnInit() {
        this.route.data.subscribe((routeData: any) => {
            this.moduleName = routeData.moduleName;
            this.setApi();
            this.getLabel();
            this.getAuth();
        });
    }

}