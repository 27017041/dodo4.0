/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {UserService} from "./user.service";
import {User, UserApi} from "./user";
import {DatatableService} from "../../datatable/datatable.service";

@Component({
    selector: 'my-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;//required
    @ViewChild('searchForm') searchForm:NgForm;//required
    
    globalLabel:any;//required
    moduleLabel:any;//required
    keyId:number;//required
    dtOptions:any;//required
    
    hasDtInstance:boolean = false;//required
    isBtnDelete:boolean = true;//required
    selectedIndex:number = 0;//required
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };//required
    tabList:Array<any> = new Array();//required
    searchData:User = new User();//required
    
    roleList:any[];
    statusList:any[];
    
    constructor(
        private label:LabelService,
        private util:UtilService,
        private us:UserService,
        private dt:DatatableService
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
        this.label.getModuleLabel('user',this);
    }

    getAuth(){
        this.util.getAuth('user',this);
    }

    getSelectList(){
        this.util.getSelectList(3,"statusList",this);
        this.us.getRoleList(this);
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

    onAdd(){
        let data = {
            type : "add",
            name : this.globalLabel['text']['btnAdd'],
            id : 0
        };
        this.onCreateTabs(data)
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

    onDelete(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            const selectData = dtInstance.rows('.selected').data();
            this.us.prepareDelete(selectData,this)
        });
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
                hasSelect:true,
                hasLink:true,
                ajax:{
                    url:UserApi.getList,
                    data:this.searchData
                },
                columns:[
                    {isSelect:true},
                    {isLink:true,keyField:"userId",data:"loginName",name:"loginName"},
                    {data:"email",name:"email"},
                    {data:"roleName",name:"roleId"},
                    {data:"statusName",name:"status"}
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