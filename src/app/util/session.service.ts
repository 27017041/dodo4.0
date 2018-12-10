/**
 * Created by Leo on 2017/9/27.
 */
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Router,NavigationExtras } from '@angular/router';
import { API } from "../config";
import {LabelService} from "./label.service";
import {CookieService} from "./cookie.service";
import {LayerService} from "../layer/layer.service";
import {MenuService} from "./menu.service";

@Injectable()
export class SessionService{
    user:any;
    lang:string;

    constructor(
        private router:Router,
        private http: HttpClient,
        private label:LabelService,
        private cookie:CookieService,
        private layer:LayerService,
        private menu:MenuService
    ){}

    getUser(){
        this.http
            .get(API.api+"/user/getUser")
            .subscribe((data:any)=>{
                if(!data.user){
                    this.router.navigate(['/extra/login']);
                }else{
                    this.user = data.user;
                    this.lang = data.lang;
                    this.label.setGlobalLabel(data.label);
                    this.menu.getMenuListFromUser();
                }
            });
    }

    logout(comp){
        const loading = this.layer.loading();
        this.http
            .get(API.api+"/user/updateAndsignOut")
            .subscribe((data:any)=>{
                loading.close();
                if(!data.session){
                    this.cookie.delCookie("uid");
                    this.cookie.delCookie("x-auth-token");
                    this.router.navigate(['/extra/login']);
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['logoutErr']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

}
