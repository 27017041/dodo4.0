/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';
import { NgForm } from '@angular/forms';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {ModuleConfigService} from "./module-config.service";
import {ModuleConfig, RelationalItem} from "./module-config";

@Component({
    selector: 'my-module-config',
    templateUrl: './module-config.component.html',
    styleUrls: ['./module-config.component.css']
})
export class ModuleConfigComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    openFieldId:number;
    moduleName:string;
    moduleList:any;
    labelTypeList:any;// fieldLabel 所属的类型
    selectOptionList:any;// 当 Field type 是 select 的时候，绑定一个select源
    moduleConf:ModuleConfig; //search grid form field 的配置
    labelOriginalList:any;
    @ViewChild('moduleSearchForm') moduleSearchForm:NgForm;

    displayList:Array<string>;
    disabledList:Array<string>;
    readonlyList:Array<string>;
    linkageList:Array<string>;

    searchList:any; // search conf 列表
    gridList:any; // grid conf 列表
    formList:any; // form conf 列表
    fieldList:any; //field 列表
    relationalList:any;//relational 列表

    fieldPageType:string;//add  detail
    fieldData:any;
    isFieldDisplay:boolean = false;//默认不显示其它tabs

    isDelSearchBtn:boolean = false;
    isDelGridBtn:boolean = false;
    isDelFormBtn:boolean = false;
    isDelFieldBtn:boolean = false;//默认删除按钮不能点击

    selectSearchIdArr:Array<number> = [];
    selectGridIdArr:Array<number> = [];
    selectFormIdArr:Array<number> = [];
    selectFieldIdArr:Array<number> = [];//已选择栏位的id 数组

    selectedIndex:number = 0;//tabs 切换

    reSearchState:boolean = false;
    reGridState:boolean = false;
    reFormState:boolean = false;// 刷新状态控制

    //relational,relational item
    relationalItemList:Array<any> = new Array();//每组item 数据
    reRelationalStateArr:Array<boolean> = new Array();//每组 item reload 状态控制
    selectRItemArr :Array<any> = new Array();//每组 item checkbox 状态控制
    isDelRItemBtnArr:Array<boolean> = new Array();//每组 item delete 状态控制

    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }

    constructor(
        private label : LabelService,
        private util : UtilService,
        private mcs : ModuleConfigService
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
        this.label.getModuleLabel('moduleConf',this);
    }

    getAuth(){
        this.util.getAuth('moduleConf',this);
    }

    getModuleList(){
        this.mcs.getModuleList(this);
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter" && this.moduleSearchForm.form.valid){
            this.onSearch();
        }
    }
    onSearch(){
        this.mcs.getModuleDetail(this);
        this.mcs.getStore(this);

    }

    /**
     *  Field
     * **/
    onAddField(){
        if(!this.isFieldDisplay){this.isFieldDisplay = true;}
        this.selectedIndex = 1;
        this.fieldPageType = "add";
        this.fieldData = undefined;
    }

    onFieldDetail(field){
        if(this.auth.rightUpdate){
            const f = Object.assign({},field);
            this.openFieldId = field.fieldId;
            if(f.validation){
                let vali = f.validation;
                vali = vali.split(",");
                for(let v in vali){
                    vali[v] = vali[v];
                }
                f.validation = vali;
            }
            this.fieldData = f;
            if(!this.isFieldDisplay){this.isFieldDisplay = true;}
            this.selectedIndex = 1;
            this.fieldPageType = "detail";
        }
    }

    onFieldChange(e,field){
        if(e.checked){
            this.selectFieldIdArr.push(field.fieldId);
        }else{
            this.util.delArrVal( this.selectFieldIdArr,field.fieldId);
        }
        if(this.selectFieldIdArr.length == 0){
            this.isDelFieldBtn = false;
        }else{
            this.isDelFieldBtn = true;
        }
    }

    onDeleteField(){
        this.mcs.prepareDelField(this.selectFieldIdArr.toString(),this);
    }

    onReload(reload:boolean){
        if(reload){
            this.mcs.getFieldList(this);
            this.selectFieldIdArr = [];
            if(this.fieldPageType == "add"){
                this.selectedIndex = 0;
                this.isFieldDisplay = false;
            }
        }
    }


    /**
     *  Config
     * **/
    onReConf(view){
        if(view == "search"){
            if(!this.reSearchState){
                this.reSearchState = true;
                this.searchList = [];
                this.isDelSearchBtn = false;
                this.mcs.getConfListByName(view,this);
            }
        }else if(view == "grid"){
            if(!this.reGridState){
                this.reGridState = true;
                this.gridList = [];
                this.isDelGridBtn = false;
                this.mcs.getConfListByName(view,this);
            }
        }else if(view == "form"){
            if(!this.reFormState){
                this.reFormState = true;
                this.formList = [];
                this.isDelFormBtn = false;
                this.mcs.getConfListByName(view,this);
            }
        }
    }

    onAddFieldInConf(view){
        this.mcs.onAddFieldInConf(view,this);
    }

    onUpdateConf(view){
        this.mcs.onUpdateConf(view,this);
    }

    onItemChange(e,item,view){
        if(view == "search"){
            if(e.checked){
                this.selectSearchIdArr.push(item.searchItemId);
            }else{
                this.util.delArrVal( this.selectSearchIdArr,item.searchItemId);
            }
            if(this.selectSearchIdArr.length == 0){
                this.isDelSearchBtn = false;
            }else{
                this.isDelSearchBtn = true;
            }
        }else if(view == "grid"){
            if(e.checked){
                this.selectGridIdArr.push(item.gridItemId);
            }else{
                this.util.delArrVal( this.selectGridIdArr,item.gridItemId);
            }
            if(this.selectGridIdArr.length == 0){
                this.isDelGridBtn = false;
            }else{
                this.isDelGridBtn = true;
            }
        }else if(view == "form"){
            if(e.checked){
                this.selectFormIdArr.push(item.formItemId);
            }else{
                this.util.delArrVal( this.selectFormIdArr,item.formItemId);
            }
            if(this.selectFormIdArr.length == 0){
                this.isDelFormBtn = false;
            }else{
                this.isDelFormBtn = true;
            }
        }
    }

    onDelConf(view){
        this.mcs.prepareDelConf(view,this);
    }

    /**
     * Relational
     * **/
    onAddRelational(){
        this.mcs.onAddRelational(this);
    }

    onUpdateRelational(){
        //this.mcs.onUpdateRelational();
    }

    onDeleteRelational(rid){
        this.mcs.prepareDelRerational(this,rid);
    }

    onAddRelationalItem(list,pIndex){
        this.mcs.getTableFieldList(this,list,pIndex,"add")
    }

    onUpdateRelationalItem(item,pIndex){
        this.mcs.getTableFieldList(this,item,pIndex,"update");
    }

    onUpdateRelationalItemSort(rid,index){
        this.mcs.onUpdateRelationalItemSort(this,rid,index);
    }

    onRelationalItemChange(e,item,pIndex){
        if(e.checked){
            this.selectRItemArr[pIndex].push(item.itemId);
        }else{
            this.util.delArrVal( this.selectRItemArr[pIndex],item.itemId);
        }
        if(this.selectRItemArr[pIndex].length == 0){
            this.isDelRItemBtnArr[pIndex] = false;
        }else{
            this.isDelRItemBtnArr[pIndex] = true;
        }
    }

    onDeleteRelationalItem(rid,pIndex){
        this.mcs.prepareDelRItem(this,rid,pIndex);
    }

    reloadRelationalItem(rid,pIndex){
        if(!this.reRelationalStateArr[pIndex]){
            this.reRelationalStateArr[pIndex] = true;
            this.relationalItemList[pIndex] = [];
            this.isDelRItemBtnArr[pIndex] = false;
            this.mcs.reloadRelationalItem(this,rid,pIndex);
        }
    }


    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getModuleList();
        this.util.getSelectList(8,"displayList",this);
        this.util.getSelectList(22,"disabledList",this);
        this.util.getSelectList(23,"readonlyList",this);
        this.util.getSelectList(24,"linkageList",this);
    }

}