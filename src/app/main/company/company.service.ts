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
import {CompanyApi} from "./company";

@Injectable()
export class CompanyService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}


    getDetail(companyId,comp){
        const loading = this.layer.loading();
        this.http
            .post(CompanyApi.getDetail,$.param({companyId:companyId}),{ headers: API.form})
            .subscribe((data:any)=>{
                comp.companyData = data.data;
                if(!comp.isDisplay){comp.isDisplay = true;}
                comp.selectedIndex = 1;
                comp.pageType = "detail";
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onSave(comp,formData?:string){
        const loading = this.layer.loading();
        let url:string;
        let msgSucc:string;
        let msgFail:string;
        let fb:any;
        if(comp.pageType == "add"){
            url = CompanyApi.saveData;
            msgSucc = "succAdd";
            msgFail = "failAdd";
            fb = comp.companyData;
        }else if(comp.pageType == "detail"){
            url = CompanyApi.updateData;
            msgSucc = "succUpdate";
            msgFail = "failUpdate";
            fb = formData;
        }
        this.http
            .post(url,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][msgSucc]},()=>{
                        if(comp.pageType == "add"){
                            comp.companyForm.onReset();
                        }
                        comp.onReload.emit(true);// list 界面数据刷新
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][msgFail]});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareDelete(selectData,comp){
        let checkIds = "";
        for(let i=0;i<selectData.length;i++){
            checkIds = checkIds+selectData[i]['companyId']+',';
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
            .post(CompanyApi.deleteData,$.param({ids:ids}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.status) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][data.msg]},()=>{
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
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][data.msg]});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }



}