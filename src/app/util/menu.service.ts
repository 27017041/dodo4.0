/**
 * Created by Leo on 2017/11/23.
 */
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import {API} from "../config";

@Injectable()
export class MenuService {
    private menuSubject:Subject<any> = new Subject<any>();
    menu$ = this.menuSubject.asObservable();

    constructor(
        private http: HttpClient,
    ) { }

    getMenuList(comp){
        this.menu$.subscribe((data)=>{
            comp.menuList = data;
            comp.isComplete = true;
        })
    }

    getMenuListFromUser(){
        this.http
            .get(API.api+"/menuTest/menuList")
            .subscribe((data:any)=>{
                this.menuSubject.next(data);
            });
    }

}