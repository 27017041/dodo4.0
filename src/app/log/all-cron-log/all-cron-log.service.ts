/**
 * Created by Carson on 2018/5/16.
 */


import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {AllCronLogApi} from "./all-cron-log";

@Injectable()
export class AllCronLogService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}

    /*getRoleList(comp){
     this.http.get(AllCronLogApi.getRoleList).subscribe((data:any)=>{
     comp.roleList = data[0];
     });
     }*/

    getDetail(emailId,comp){

        const loading = this.layer.loading();
        this.http
            .post(AllCronLogApi.getDetail+'/'+emailId,$.param({}),{ headers: API.form})
            .subscribe((data:any)=>{

                const ud = Object.assign({}, data.messageMail);
                // ud.roleId = ud.roleId.split(",");
                // for(let r in ud.roleId){
                //     ud.roleId[r] = parseInt(ud.roleId[r]);
                // }
                console.log(ud)
                comp.AllCronLogData = ud;
                console.log(comp.allCronLogData);
                if(!comp.isDisplay){comp.isDisplay = true;}
                comp.selectedIndex = 2;
                comp.pageType = "detail";
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    /*onSave(formData,comp){
     const loading = this.layer.loading();
     this.http
     .post(AllCronLogApi.onSave,$.param(formData),{ headers: API.form })
     .subscribe((data:any)=>{
     loading.close();
     if(data.status) {
     this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][data.msg]},()=>{
     if(comp.pageType == "add"){
     comp.userForm.onReset();
     }
     comp.onReload.emit(true);//role list 界面数据刷新
     });
     }else{
     this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips'][data.msg]});
     }
     },err => {
     loading.close();
     this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
     });
     }*/

    prepareDelete(selectData,comp){
        let checkIds = "";
        for(let i=0;i<selectData.length;i++){
            checkIds = checkIds+selectData[i]['userId']+',';
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
            .post(AllCronLogApi.onDelete,$.param({userIds:ids}),{ headers:API.form })
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