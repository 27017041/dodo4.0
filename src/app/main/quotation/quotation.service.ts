/**
 * Created by Carson on 2018/5/23.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {QuotationApi, QuotationalRelationalItem, QuotationalRelational} from "./quotation";
import * as moment from 'moment';
import {QuotationLinkageComponent} from "./dialog/quotation-linkage.component";

@Injectable()
export class QuotationService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}

    getRoleList(comp){
        this.http.get(QuotationApi.getRoleList).subscribe((data:any)=>{
            comp.roleList = data[0];
        });
    }

    getClientOList(comp){
        this.http.get(QuotationApi.getClientList).subscribe((data:any)=>{
            comp.clientOList = data.data;
        })
    }

    getContactOList(comp){
        this.http.get(QuotationApi.getContactList).subscribe((data:any)=>{
            comp.contactOList = data.data;
        })
    }

    getCurrency(comp){
        this.http.get(QuotationApi.getCurrency).subscribe((data:any)=>{
            comp.currencyList = data.data;
        })
    }

    getDetail(quotationId,comp){
        this.http
            .post(QuotationApi.getDetail,$.param({keyId:quotationId}),{ headers: API.form})
            .subscribe((data:any)=>{
                const ud = Object.assign({}, data.data[0]);
                // ud.roleId = ud.roleId.split(",");
                // for(let r in ud.roleId){
                //     ud.roleId[r] = parseInt(ud.roleId[r]);
                // }
                ud.createDate = moment(parseInt( ud.createDate)).format("YYYY-MM-DD");
                comp.quotationData = ud;
                comp.oldQuotationData = Object.assign({}, ud);
            });
    }

    onChange(formData,comp){
        const loading = this.layer.loading();
        this.http
            .post(QuotationApi.onUpdate,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                        if(comp.pageType == "add"){
                            comp.quotationForm.onReset();
                        }
                        comp.onReload.emit(true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onSave(formData,comp){
        const loading = this.layer.loading();
        this.http
            .post(QuotationApi.onSave,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succSave']},()=>{
                        if(comp.pageType == "add"){
                            comp.quotationForm.onReset();
                        }
                        comp.onReload.emit(true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failSave']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareDelete(selectData,comp){
        let checkIds = "";
        for(let i=0;i<selectData.length;i++){
            checkIds = checkIds+selectData[i]['quotationId']+',';
        }
        checkIds = checkIds.substring(0,checkIds.length-1);
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem);
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.onDelete(checkIds,comp);
            }
        });
    }

    onDelete(ids,comp){
        const loading = this.layer.loading();
        this.http
            .post(QuotationApi.onDelete,$.param({keyIds:ids}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.status) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        const idsArr = ids.split(",");
                        for(let i of idsArr){
                            if(i == comp.openId){
                                if(comp.isDisplay){comp.isDisplay = false;}
                            }
                        }
                        comp.onReset();
                        comp.onSearch();
                        comp.isBtnDelete = true;
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    /**获取联动配置，第一个关联模块List**/
    getLinkageModuleList(comp){
        let moduleArr = comp.linkageFieldList.linkageModule.split(",");
        let moduleViewArr = comp.linkageFieldList.linkageViews.split(",");
        let moduleKeyArr = comp.linkageFieldList.linkageKey.split(",");
        this.http
            .post(QuotationApi.getLinkageModuleList,"viewsName="+moduleViewArr[0],{ headers:API.form })
            .subscribe((data:any)=>{
                for(let i = 0; i < data.data.length; i++ ){
                    data.data[i].moduleName =  moduleArr[0];
                    data.data[i].linkageViews =  moduleViewArr[0];
                    data.data[i].linkageKey =  moduleKeyArr[0];
                    data.data[i].nextLinkageModule =  moduleArr[1];
                    data.data[i].nextLinkageViews =  moduleViewArr[1];
                }
                comp.linkageModuleList[0] = data.data;
            })
    }

    /**打开联动设置框**/
    openLinkageDialog(comp){
        const dialogRef = this.dialog.open( QuotationLinkageComponent,{
            width:"50%",
            disableClose:true,
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                linkageModuleList:comp.linkageModuleList,
                linkageFieldList:comp.linkageFieldList
            },
        });
        dialogRef.afterClosed().subscribe((result:any) => {
            console.log(result)
            if(result){
                comp.quotationData.linkageModule = JSON.stringify(result.linkageData);
                for(let l of result.linkageData){
                    comp.quotationData[l.linkageKey] = l.linkageId;
                    comp.quotationData[l.moduleName+"Name"] = l.linkageName;
                }
            }
        });
    }

    /**配置关联表格的初始数据**/
    getRelational(comp){
        comp.relationalList = QuotationalRelational;

        comp.dtOptionsList = new Array(comp.relationalList.length);
        comp.relationalFieldList = new Array(comp.relationalList.length);

        const arr = QuotationalRelationalItem;

        for(let r=0; r<comp.relationalList.length; r++){
            comp.relationalFieldList[r] = arr[r];
            for(let r2 of comp.relationalFieldList[r]){
                r2.moduleName = comp.relationalList[r].moduleName;
                r2.relationalName = comp.relationalList[r].relationalName;
                r2.tableField = comp.relationalList[r].tableField;
                r2.tableKey = comp.relationalList[r].tableKey;
                r2.tableName = comp.relationalList[r].tableName;
            }
        }
        for(let r of comp.relationalList){
            this.http
                .post(API.api + "/label/getLabel", $.param({module: r.relationalName}), {headers: API.form})
                .subscribe((data: any) => {
                    comp.relationalLabelList[r.relationalName] = data.label;
                });
        }

        comp.setRelationalGrid(comp.relationalFieldList);
        comp.setQuotationItemGrid();
    }
}