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
import {LabelConfApi,Label} from "./label-config";

@Injectable()
export class LabelConfigService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer: LayerService
    ) {}

    getLabelTypeList(comp){
        this.http.get(LabelConfApi.getLabelTypeList).subscribe((data:any)=>{
            comp.labelTypeList = data.refOptionList;
        });
    }

    onDetail(id,comp,isRefresh?){
        const loading = this.layer.loading();
        this.http
            .post(LabelConfApi.getLabelDetail,$.param({"labelOriginal":id,"labelType":comp.labelType.optionId}),{ headers: API.form })
            .subscribe((data:any)=>{
                comp.labelDetailData = data.confLabelList;
                if(!comp.isDisplay){comp.isDisplay = true;}
                comp.selectedIndex = 1;
                comp.pageType = "detail";
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onSaveLabel(formData,comp){
        const loading = this.layer.loading();
        let url:string;
        let msgSucc:string;
        let msgFail:string;
        if(comp.pageType == "add"){
            url = LabelConfApi.saveLabel;
            msgSucc = "succAdd";
            msgFail = "failAdd";
        }else if(comp.pageType == "detail"){
            url = LabelConfApi.updateLabel;
            msgSucc = "succUpdate";
            msgFail = "failUpdate";
        }
        this.http
            .post(url,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][msgSucc]},()=>{
                        if(comp.pageType == "add"){
                            comp.labelForm.onReset();
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

}
