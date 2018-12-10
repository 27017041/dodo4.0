/**
 * Created by Carson on 2018/5/10.
 */
import { Injectable } from '@angular/core';;
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {EmailLogApi} from "./email-log";

@Injectable()
export class EmailLogService {

    constructor(
        private http: HttpClient,
        private layer:LayerService
    ){}


    getDetail(comp){
        const loading = this.layer.loading();
        this.http
            .post(EmailLogApi.getDetail+"/"+comp.keyId,null,{ headers: API.form})
            .subscribe((data:any)=>{
                comp.formData = data.messageMail;
                comp.oldFormData = Object.assign({}, data.messageMail);
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }




}