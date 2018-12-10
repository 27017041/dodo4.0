/**
 * Created by Leo on 2017/12/15.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {SchedulerApi, Scheduler} from "./scheduler";

@Injectable()
export class SchedulerService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer: LayerService
    ) {}

    getDetail(keyId,comp){
        const loading = this.layer.loading();
        this.http
            .post(SchedulerApi.getDetail,$.param({keyId:keyId}),{ headers: API.form})
            .subscribe((data:any)=>{
                const sd = Object.assign({}, data.data);
                if(sd.monthDay){
                    sd.monthDay =sd.monthDay.split(",");
                }
                if(sd.weekDay){
                    sd.weekDay =sd.weekDay.split(",");
                }
                if(sd.hourDay){
                    sd.hourDay = sd.hourDay.split(",");
                }
                if(sd.minuteHour){
                    sd.minuteHour = sd.minuteHour.split(",");
                }

                if(!comp.isDisplay){comp.isDisplay = true;}
                comp.selectedIndex = 1;
                comp.pageType = "detail";
                comp.schedulerData = sd;
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onSave(fb,comp){
        const loading = this.layer.loading();
        let url:string;
        let msgSucc:string;
        let msgFail:string;
        if(comp.pageType == "add"){
            url = SchedulerApi.addCron;
            msgSucc = "succAdd";
            msgFail = "failAdd";
        }else if(comp.pageType == "detail"){
            url = SchedulerApi.updateCron;
            msgSucc = "succUpdate";
            msgFail = "failUpdate";
        }
        this.http
            .post(url,$.param(fb),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][msgSucc]},()=>{
                        if(comp.pageType == "add"){
                            comp.schedulerForm.onReset();
                        }
                        comp.onReload.emit(true);
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
            checkIds = checkIds+selectData[i]['cronId']+',';
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
            .post(SchedulerApi.deleteCron,$.param({cronIds:ids}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        const idsArr = ids.split(",");
                        for(let i of idsArr){
                            if(i == comp.openId){
                                if(comp.isDisplay){comp.isDisplay = false;}
                            }
                        }
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
}
