/**
 * Created by Leo on 2017/12/15.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams, HttpRequest, HttpEventType,HttpResponse } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {ImageApi} from "./image";
import {DialogAddSettingComponent} from "./dialog/dialog-add-setting.component";


@Injectable()
export class ImageService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer: LayerService
    ) {}

    getSettingList(comp){
        this.http.get(ImageApi.getSettingList).subscribe((data:any)=>{
            comp.settingList = data.confImageTypeList;
        });
    }

    onAdd(comp){
        const dialogRef = this.dialog.open( DialogAddSettingComponent, {
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                pageType: 'add'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                const loading = this.layer.loading();
                this.http
                    .post(ImageApi.addSetting,$.param({confImageTypeData:JSON.stringify(result)}),{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                                this.getSettingList(comp);
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

    onDetail(data,comp){
        const d = Object.assign({},data);
        const dialogRef = this.dialog.open( DialogAddSettingComponent, {
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                pageType: 'detail',
                setting:d
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                const loading = this.layer.loading();
                this.http
                    .post(ImageApi.updateSetting,$.param({confImageTypeData:JSON.stringify(result)}),{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result){
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                                this.getSettingList(comp);
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

    prepareDel(comp){
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                let itemIds:Array<number> = [];
                itemIds = comp.selcetSettingArr.toString();
                this.onDelete(itemIds,comp);
            }
        });
    }

    onDelete(itemIds,comp){
        const loading = this.layer.loading();
        this.http
            .post(ImageApi.deleteSetting,$.param({confIds:itemIds}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        comp.isDelBtn = false;
                        this.getSettingList(comp);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    uploadImage(fb,comp){
        const req = new HttpRequest('POST', ImageApi.uploadImage, fb, {
            reportProgress: true,
        });

        this.http.request(req).subscribe((event:any) => {
            if (event.type === HttpEventType.UploadProgress) {//Compute and show the % done:
                const percentDone = Math.round(100 * event.loaded / event.total);
                console.log(percentDone);
            } else if (event instanceof HttpResponse) {//completely uploaded!
                if(event.body.result){
                    comp.selectImage.emit(API.api + event.body.msg)
                }
            }
        },err => {
            this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
        })
    }

    getWatermark(comp,refresh?){
        this.http.get(ImageApi.getWatermark).subscribe((data:any)=>{
            comp.watermark.confId = data.waterMark.confId?data.waterMark.confId:null;
            comp.watermark.type = data.waterMark.type?data.waterMark.type:"image";
            comp.watermark.position = data.waterMark.position?data.waterMark.position:"bottomRight";
            comp.watermark.scaling = data.waterMark.scaling?data.waterMark.scaling:"off";
            comp.watermark.size = data.waterMark.size?data.waterMark.size:400;
            comp.watermark.transparency = data.waterMark.transparency?data.waterMark.transparency:0;
            comp.watermark.url = data.waterMark.url? API.api + data.waterMark.url:null;
            comp.watermark.textFont = data.waterMark.textFont?data.waterMark.textFont:"arial";
            comp.watermark.textSize = data.waterMark.textSize?data.waterMark.textSize:12;
            comp.watermark.textColor = data.waterMark.textColor?data.waterMark.textColor:"white";
            comp.watermark.textMargin = data.waterMark.textMargin?data.waterMark.textMargin:5;
            comp.watermark.textBgColor = data.waterMark.textBgColor?data.waterMark.textBgColor:"gray";
            comp.oldWatermark = Object.assign({},comp.watermark);

            if(refresh){
                comp.waterForm.reset(comp.watermark);
            }
        });
    }

    onPreview(comp){
        const loading = this.layer.loading();
        /*if(comp.watermark.type == "text"){
            delete comp.watermark.url;
        }else if(comp.watermark.type == "image"){
            delete comp.watermark.textFont;
            delete comp.watermark.textSize;
            delete comp.watermark.textColor;
            delete comp.watermark.textMargin;
            delete comp.watermark.textBgColor;
        }*/

        this.http
            .post(ImageApi.preview,$.param({confData:JSON.stringify(comp.watermark)}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    comp.previewUrl = API.api + data.url;
                    setTimeout(()=>{
                        window.scrollTo(0, 1000);
                    },500)
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    saveWatermarkSetting(comp){
        const loading = this.layer.loading();
        if(comp.watermark.type == "text"){
            delete comp.watermark.url;
        }else if(comp.watermark.type == "image"){
            delete comp.watermark.textFont;
            delete comp.watermark.textSize;
            delete comp.watermark.textColor;
            delete comp.watermark.textMargin;
            delete comp.watermark.textBgColor;
        }

        let fb:any = {};
        let wm = Object.assign({},comp.watermark);
        fb.confData = JSON.stringify(wm);
        this.http
            .post(ImageApi.saveWatermark,$.param(fb),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succSave']},()=>{
                        this.getWatermark(comp,true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failSave']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }


}
