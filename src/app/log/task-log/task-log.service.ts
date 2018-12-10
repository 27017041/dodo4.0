/**
 * Created by Carson on 2018/5/10.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {TaskLogApi} from "./task-log";

@Injectable()
export class TaskLogService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}

    getDetail(id,comp){
        const loading = this.layer.loading();
        this.http
            .post(TaskLogApi.getDetail,$.param({cronLogId:id}),{ headers: API.form})
            .subscribe((data:any)=>{
                const ud = Object.assign({}, data.cronLog);
                comp.taskLogData = ud;
                if(!comp.isDisplay){comp.isDisplay = true;}
                comp.selectedIndex = 2;
                comp.pageType = "detail";
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareDelete(selectData,comp){
        let checkIds = "";
        for(let i=0;i<selectData.length;i++){
            checkIds = checkIds+selectData[i]['userId']+',';
        }
        checkIds = checkIds.substring(0,checkIds.length-1);
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                console.log('sadf');
                // this.onDelete(checkIds,comp);
            }
        });
    }

    onDelete(ids,comp){
        const loading = this.layer.loading();
        this.http
            .post(TaskLogApi.onDelete,$.param({userIds:ids}),{ headers:API.form })
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