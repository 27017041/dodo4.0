/**
 * Created by Leo on 2017/11/30.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {ModuleConfApi, ModuleConfig} from "./module-config";
import {DialogAddConfigComponent} from "./dialog/dialog-add-config.component";
import {DialogAddRelationalComponent} from "./dialog/dialog-add-relational.component";
import {UtilService} from "../../util/util.service";
import {DialogAddRelationalItemComponent} from "./dialog/dialog-add-relational-item.component";

@Injectable()
export class ModuleConfigService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService,
        private us:UtilService
    ){}

    getModuleList(comp){
        this.http.get(ModuleConfApi.getModuleList).subscribe((data:any)=>{
            comp.moduleList = data;
        });
    }

    getModuleDetail(comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.getModuleDetail,$.param({"moduleName":comp.moduleName}),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                comp.moduleConf = new ModuleConfig(data);
                comp.searchList = data.searchFieldList;
                comp.gridList = data.gridFieldList;
                comp.formList = data.formFieldList;
                comp.fieldList = data.fieldList;
                comp.relationalList = undefined;

                if(data.relationalList){
                    comp.relationalList = data.relationalList;
                    comp.relationalItemList = new Array();
                    for(let r = 0; r < data.relationalList.length; r++ ){
                        comp.reRelationalStateArr.push(false);
                        comp.relationalItemList.push([]);
                        comp.selectRItemArr.push([]);
                        comp.isDelRItemBtnArr.push(false);
                        for(let item of data.relationalItemList){
                            if(item.relationalId == data.relationalList[r].id){
                                comp.relationalItemList[r].push(item);
                            }
                        }
                    }
                }

                this.getLabelOrginalList(comp);
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    getStore(comp){
        this.http
            .post(ModuleConfApi.getLabelType,$.param({"moduleName":comp.moduleName}),{ headers: API.form })
            .subscribe((data:any)=>{
                comp.labelTypeList = data.labelTypeList;
            });
        this.http
            .post(ModuleConfApi.getSelectOption,$.param({"moduleName":comp.moduleName}),{ headers: API.form })
            .subscribe((data:any)=>{
                comp.selectOptionList = data.selectOptionList;
            });
    }



    /**
     *  Conf
     * **/
    getConfListByName(viewName,comp){
        this.http
            .post(ModuleConfApi.getConfListByName,$.param({"moduleName":comp.moduleName,"viewName":viewName}),{ headers: API.form })
            .subscribe((data:any)=>{
                if(viewName == "search"){
                    comp.searchList = data.searchFieldList;
                    comp.reSearchState = false;
                    comp.selectSearchIdArr = [];
                }else if(viewName == "grid"){
                    comp.gridList = data.gridFieldList;
                    comp.reGridState = false;
                    comp.selectGridIdArr = [];
                }else if(viewName == "form"){
                    comp.formList = data.formFieldList;
                    comp.reFormState = false;
                    comp.selectFormIdArr = [];
                }else if(viewName == "relational"){
                    comp.relationalList = data.relationalList;
                    comp.relationalItemList = new Array();//每组item 数据
                    comp.reRelationalStateArr = new Array();//每组 item reload 状态控制
                    comp.selectRItemArr = new Array();//每组 item checkbox 状态控制
                    comp.isDelRItemBtnArr = new Array();//每组 item delete 状态控制
                    for(let r = 0; r < data.relationalList.length; r++ ){
                        comp.reRelationalStateArr.push(false);
                        comp.relationalItemList.push([]);
                        comp.selectRItemArr.push([]);
                        comp.isDelRItemBtnArr.push(false);
                        for(let item of data.relationalItemList){
                            if(item.relationalId == data.relationalList[r].id){
                                comp.relationalItemList[r].push(item);
                            }
                        }
                    }
                }
            });
    }

    onAddFieldInConf(view,comp){
        const dialogRef = this.dialog.open( DialogAddConfigComponent, {
            data: {
                type: view,
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                fieldList: comp.fieldList
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                let flag = false;
                let clist;
                if(view == "search"){
                    clist = comp.searchList;
                }else if(view == "grid"){
                    clist = comp.gridList;
                }else if(view == "form"){
                    clist = comp.formList;
                }
                for(let s of clist){
                    if(s.fieldId == result.fieldId){
                        flag = true;
                    }
                }
                if(!flag){
                    this.onAddConf(result.fieldId, view, comp);
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.moduleLabel['tips']['existedField'],time:3000});
                }
            }
        });
    }

    onAddConf(fieldId,view,comp){
        const fb = { "fieldId":fieldId, "viewName":view }
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.addConf,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                        this.getConfListByName(view,comp);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failAdd']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onUpdateConf(view,comp){
        const itemIds =  this.prepareUpdate(view,comp);
        const fb = { "itemIds":itemIds, "viewName":view }
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.updateConf,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                        this.getConfListByName(view,comp);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareUpdate(view,comp){
        let clist:any;
        let itemIdArr:Array<number> = [];
        if(view == "search"){
            clist = comp.searchList;
            for(let c of clist){
                itemIdArr.push(c.searchItemId);
            }
        }else if(view == "grid"){
            clist = comp.gridList;
            for(let c of clist){
                itemIdArr.push(c.gridItemId);
            }
        }else if(view == "form"){
            clist = comp.formList;
            for(let c of clist){
                itemIdArr.push(c.formItemId);
            }
        }
        return itemIdArr.toString();
    }

    prepareDelConf(view,comp){
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                let itemIds:Array<number> = [];
                if(view == "search"){
                    itemIds = comp.selectSearchIdArr.toString();
                }else if(view == "grid"){
                    itemIds = comp.selectGridIdArr.toString();
                }else if(view == "form"){
                    itemIds = comp.selectFormIdArr.toString();
                }
                this.onDelConf(itemIds,view,comp);
            }
        });
    }

    onDelConf(itemIds,view,comp){
        const loading = this.layer.loading();
        const fb = { "itemId":itemIds, "viewName":view };
        this.http
            .post(ModuleConfApi.deleteConf,$.param(fb),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        if(view == "search"){
                            comp.isDelSearchBtn = false;
                        }else if(view == "grid"){
                            comp.isDelGridBtn = false;
                        }else if(view == "form"){
                            comp.isDelFormBtn = false;
                        }
                        this.getConfListByName(view,comp);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }



    /**
     *  Field
     * **/
    getFieldList(comp){
        this.http
            .post(ModuleConfApi.getFieldList,$.param({"moduleName":comp.moduleName}),{ headers: API.form })
            .subscribe((data:any)=>{
                comp.fieldList = data.fileldList;
                comp.selectFieldIdArr = [];
            });
    }

    //获取label original 列表
    getLabelOrginalList(comp){
        this.http
            .post(ModuleConfApi.getLabelOriginalList,$.param({"moduleName":comp.moduleName}),{ headers: API.form })
            .subscribe((data:any)=>{
                comp.labelOriginalList = data.labelOriginalList;
            });
    }

    onAddField(fb,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.addField,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                        comp.fieldAddForm.onReset();
                        comp.onReload.emit(true);//role list 界面数据刷新
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failAdd']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onUpdateField(fb,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.updateFieldInModule,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                        comp.oldFieldData = comp.fieldData;
                        comp.fieldDetailForm.reset(comp.oldFieldData);
                        comp.onReload.emit(true);//role list 界面数据刷新
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareDelField(checkIds,comp){
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.onDelField(checkIds,comp);
            }
        });
    }

    onDelField(ids,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.deleteFieldInModule,$.param({fieldIds:ids}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        const idsArr = ids.split(",");
                        for(let i of idsArr){
                            if(i == comp.openFieldId){
                                if(comp.isFieldDisplay){comp.isFieldDisplay = false;}
                            }
                        }
                        comp.isDelFieldBtn = false;
                        this.getFieldList(comp);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    /**
     * Realation
     * **/
    onAddRelational(comp){
        const dialogRef = this.dialog.open( DialogAddRelationalComponent, {
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                moduleList: comp.moduleList
            },
            width:'800px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                result.moduleName = comp.moduleName;
                result.isDelete = result.isDelete?1:0;
                result.isHistory = result.isHistory?1:0;
                const fb = JSON.stringify(result);
                const loading = this.layer.loading();
                this.http
                    .post(ModuleConfApi.addRelational,"relationalData="+fb,{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                                this.getConfListByName("relational",comp)
                            });
                        }else{
                            this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failAdd']});
                        }
                    },err => {
                        loading.close();
                        this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
                    });
            }
        });
    }

    prepareDelRerational(comp,rid) {
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.onDeleteRelational(rid, comp);
            }
        });
    }
    onDeleteRelational(rid,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.deleteRelational,"ids="+rid,{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        this.getConfListByName("relational",comp)
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    /**
     * Relational Item
     * **/
    getTableFieldList(comp,list,index,view){
        const loading = this.layer.loading();
        let tableName:string;
        if(view == "add"){
            tableName = list.tableName;
        }else if(view == "update"){
            tableName = comp.relationalList[index].tableName;
        }
        this.http
            .post(ModuleConfApi.getTableFields,"tableName="+tableName,{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                let tableFieldsList = data.tableFieldsList;
                if(view == "add"){
                    this.onAddRelationalItem(comp,list,tableFieldsList,index);
                }else if(view == "update"){
                    this.onUpdateRelationalItem(comp,list,tableFieldsList,index);
                }

            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });

    }
    onAddRelationalItem(comp,list,tableFieldsList,index) {
        const dialogRef = this.dialog.open(DialogAddRelationalItemComponent, {
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                relational: list,
                tableFieldsList:tableFieldsList,
                pageType:"add"
            },
            width: '800px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                result.isLink = result.isLink?1:0;
                result.isDelete = result.isDelete?1:0;
                result.isHistory = result.isHistory?1:0;
                result.isDisplay = result.isDisplay?1:0;
                const fb = JSON.stringify(result);
                const loading = this.layer.loading();
                this.http
                    .post(ModuleConfApi.addRelationalItem,"relationalItemData="+fb,{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                                this.reloadRelationalItem(comp,result.relationalId,index);
                            });
                        }else{
                            this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failAdd']});
                        }
                    },err => {
                        loading.close();
                        this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
                    });
            }
        });
    }

    reloadRelationalItem(comp,relationalId,index){
        this.http
            .post(ModuleConfApi.reloadRelationalAndItem,"id="+relationalId,{ headers: API.form })
            .subscribe((data:any)=>{
                comp.relationalList[index] = data.relational;
                comp.relationalItemList[index] = data.relationalItemList;
                comp.reRelationalStateArr[index] = false;
                comp.selectRItemArr[index] = [];
            },err => {
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onUpdateRelationalItem(comp,item,tableFieldsList,index){
        const dialogRef = this.dialog.open(DialogAddRelationalItemComponent, {
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                relationalItem: item,
                tableFieldsList:tableFieldsList,
                pageType:"update"
            },
            width: '800px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                result.isLink = result.isLink?1:0;
                result.isDelete = result.isDelete?1:0;
                result.isHistory = result.isHistory?1:0;
                result.isDisplay = result.isDisplay?1:0;
                const fb = JSON.stringify(result);
                const loading = this.layer.loading();
                this.http
                    .post(ModuleConfApi.updateRelationalItem,"relationalItemData="+fb,{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                                this.reloadRelationalItem(comp,result.relationalId,index);
                            });
                        }else{
                            this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                        }
                    },err => {
                        loading.close();
                        this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
                    });
            }
        });
    }

    onUpdateRelationalItemSort(comp,rid,index){
        const itemIds = this.prepareUpdateRelationalItemSort(comp,index);
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.updateSortInRelationalItem,"itemIds="+itemIds,{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                        this.reloadRelationalItem(comp,rid,index);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareUpdateRelationalItemSort(comp,index){
        let clist:any;
        let itemIdArr:Array<number> = [];

        clist = comp.relationalItemList[index];
        for(let c of clist){
            itemIdArr.push(c.itemId);
        }

        return itemIdArr.toString();
    }

    prepareDelRItem(comp,rid,index){
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                let itemIds:Array<number> = [];
                itemIds = comp.selectRItemArr[index].toString();
                this.onDelRelationalItem(itemIds,rid,index,comp);
            }
        });
    }

    onDelRelationalItem(itemIds,rid,index,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleConfApi.deleteRelationalItem,"ids="+itemIds,{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        comp.isDelRItemBtnArr[index] = false;
                        this.reloadRelationalItem(comp,rid,index);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }




}