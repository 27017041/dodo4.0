/**
 * Created by Leo on 2017/11/28.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {RoleApi} from "./role";
import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";

@Injectable()
export class RoleService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}

    onAdd(fb,comp){
        const loading = this.layer.loading();
        this.http
            .post(RoleApi.save,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.status) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][data.msg]},()=>{
                        comp.detailForm.onReset();
                        comp.onReload.emit(true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][data.msg]});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    getDetail(comp){
        const loading = this.layer.loading();
        this.http
            .post(RoleApi.getDetail,$.param({roleId:comp.keyId}),{ headers: API.form})
            .subscribe((data:any)=>{
                comp.formData = data.formData;
                comp.oldFormData = Object.assign({}, data.formData);
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onUpdate(formData,comp){
        const loading = this.layer.loading();
        this.http
            .post(RoleApi.save,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.status) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][data.msg]},()=>{
                        this.getDetail(comp);
                        comp.onReload.emit(true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][data.msg]});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareDelete(selectData,comp){
        let checkIds = "";
        for(let i=0;i<selectData.length;i++){
            checkIds = checkIds+selectData[i]['roleId']+',';
        }
        checkIds = checkIds.substring(0,checkIds.length-1);
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.onDelete(checkIds,comp);
            }
        });
    }

    onDelete(ids,comp){
        const loading = this.layer.loading();
        this.http
            .post(RoleApi.onDelete,$.param({ids:ids}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.status) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][data.msg]},()=>{
                        //判断打开的tabs 含有被删除的tab，然后关闭tab。
                        const idsArr = ids.split(",");
                        const tabArr = Object.assign([],comp.tabList);
                        for(let id of idsArr){
                            for(let t = 0; t < tabArr.length; t++){
                                if(id == tabArr[t].id){
                                    comp.tabList.splice(t,1);
                                }
                            }
                        }
                        comp.onReset();
                        comp.onSearch();
                        comp.isBtnDelete = true;
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][data.msg]});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

}