/**
 * Created by Leo on 2017/12/15.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {DialogItemListComponent} from "./dialog/dialog-list-item.component";
import {ListConfApi} from "./list-config";
import {API} from "../../config";

@Injectable()
export class ListConfigService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer: LayerService
    ) {}

    getModuleList(comp){
        this.http.get(ListConfApi.getModuleList).subscribe((data:any)=>{
            comp.moduleList = data.moduleList;
        });
    }

    getListItem(comp,type?){
        this.http.get(ListConfApi.getListItem).subscribe((data:any)=>{
            comp.itemList = data.refOptionTypeList;
            if(type == 'edit'){
                const typeId = comp.selectItem.typeId;
                for(let item of comp.itemList){
                    if(item.typeId == typeId){
                        comp.selectItem.typeId = item.typeId;
                    }
                }
            }
        });
    }

    onAdd(comp){
        const dialogRef = this.onOpenDialog("add",comp);
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                if(!result.moduleName){
                    result.moduleName = null;
                }
                const loading = this.layer.loading();
                this.http
                    .post(ListConfApi.addListItem,$.param(result),{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                                this.getListItem(comp);
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

    onEdit(comp){
        const dialogRef = this.onOpenDialog("edit",comp);
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                const loading = this.layer.loading();
                this.http
                    .post(ListConfApi.editListItem,$.param(result),{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                                this.getListItem(comp,'edit');
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

    onOpenDialog(view,comp){
        return this.dialog.open( DialogItemListComponent, {
            data: {
                type: view,
                moduleList:comp.moduleList,
                itemData:comp.listItem ,
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel
            }
        });
    }

    onDetail(optionId,comp,isRefresh?){
        const loading = this.layer.loading();
        this.http
            .post(ListConfApi.getOptDetail,$.param({optionId:optionId}),{ headers: API.form})
            .subscribe((data:any)=>{
                comp.listItemOptData = data.refOptionDetail;
                if(!comp.isDisplay){comp.isDisplay = true;}
                comp.selectedIndex = 1;
                comp.pageType = "detail";
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onSaveOpt(comp){
        const loading = this.layer.loading();
        let url:string;
        let msgSucc:string;
        let msgFail:string;
        if(comp.pageType == "add"){
            url = ListConfApi.addOpt;
            msgSucc = "succAdd";
            msgFail = "failAdd";
        }else if(comp.pageType == "detail"){
            url = ListConfApi.updateOpt;
            msgSucc = "succUpdate";
            msgFail = "failUpdate";
        }
        this.http
            .post(url,$.param(comp.listItemOptData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][msgSucc]},()=>{
                        if(comp.pageType == "add"){
                            comp.optForm.onReset();
                        }
                        comp.onReload.emit(true);//role list 界面数据刷新
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][msgFail]});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

}
