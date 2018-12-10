/**
 * Created by Leo on 2017/11/23.
 */
import {Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';

import {LabelService} from "../../util/label.service";
import {Role, RoleApi} from "./role";
import {RoleService} from "./role.service";
import {UtilService} from "../../util/util.service";
import {DatatableService} from "../../datatable/datatable.service";

@Component({
    selector: 'my-role',
    templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;//required
    @ViewChild('searchForm') searchForm:NgForm;//required
    
    globalLabel:any;//required
    moduleLabel:any;//required
    keyId:number;//required
    dtOptions:any;//required
    
    selectedIndex:number = 0;//required
    hasDtInstance:boolean = false;//required
    isBtnDelete:boolean = true;//required
    auth = { rightDelete:0, rightInsert:0, rightRead:0, rightUpdate:0 };//required
    tabList:Array<any> = new Array();//required
    searchData:Role = new Role();//required
    
    statusList:any[];

    constructor(private label: LabelService,
                private rs: RoleService,
                private util: UtilService,
                private dt: DatatableService) {
    }

    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }

    onIndexChange(index: number) {
        this.selectedIndex = index;
    }

    getLabel() {
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('role', this);
    }

    getAuth() {
        this.util.getAuth('role', this);
    }

    getSelectList() {
        this.util.getSelectList(1, "statusList", this);
    }

    @HostListener("document:keydown", ["$event"])
    onKeydown(e) {
        if (e.key == "Enter") {
            this.onSearch();
        }
    }

    onSearch() {
        this.dt.onSearch(this);
    }

    onReset() {
        this.searchForm.onReset();
    }

    onAdd() {
        let data = {type:"add",name: this.globalLabel['text']['btnAdd'],id:0};
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
    
    onDelete() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            const selectData = dtInstance.rows('.selected').data();
            this.rs.prepareDelete(selectData, this)
        });
    }

    onReload(reload: boolean) {
        if(reload){
            this.onSearch();
        }
    }

    setGrid() {
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect: true,
                hasLink: true,
                ajax: {
                    url: RoleApi.getList,
                    data:this.searchData
                },
                columns: [
                    {isSelect: true},
                    {isLink: true, keyField: "roleId", data: "roleName", name: "roleName"},
                    {data: "statusValue", name: "status"}
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