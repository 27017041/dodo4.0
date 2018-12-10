/**
 * Created by Leo on 2017/11/30.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {AssignApi} from "./assign";
import {API} from "../../config";

@Injectable()
export class AssignService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}

    getRoleList(comp){
        this.http.get(AssignApi.getRoleList).subscribe((data:any)=>{
            comp.roleList = data[0];
        });
    }

    getRoleMap(comp){
        const loading = this.layer.loading();
        this.http
            .post(AssignApi.getRoleMap,$.param(comp.assign),{ headers: API.form })
            .subscribe((data:any)=>{
                const rightData = data.rightData;
                this.getMenuList(comp,rightData,loading);
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    getMenuList(comp,rightData,loading){
        this.http
            .get(AssignApi.getMenuList)
            .subscribe((data:any)=>{
                let memuArr = [];
                const menuList = data;
                const childList = data;
                let parentArr = [];
                let childArr = [];
                for(let menu of  menuList){
                    if(!rightData['menu'+menu.menuId]){
                        rightData['menu'+menu.menuId] = {
                            all:false,
                            delete:false,
                            insert: false,
                            menuId: menu.menuId,
                            read: false,
                            update: false
                        };
                    }

                    if(menu.parentId == 0){
                        parentArr.push(menu);
                        for(let child of childList ){
                            if(child.parentId == menu.menuId){
                                childArr.push(child);
                            }
                        }
                        childArr.sort(function (a,b) {
                            return a.sort - b.sort;
                        })
                        memuArr = memuArr.concat(parentArr,childArr);
                        parentArr = [];
                        childArr = [];
                    }
                }

                comp.menuList = memuArr;
                comp.rightData = rightData;
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onSave(comp){
        const loading = this.layer.loading();
        this.http
            .post(AssignApi.onSave,$.param({'roleId':comp.assign.roleId,'rightData':JSON.stringify(comp.rightData)}),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.status){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips'][data.msg]},()=>{
                        comp.onSearch();
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