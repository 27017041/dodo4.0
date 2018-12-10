/**
 * Created by Leo on 2017/11/29.
 */
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import {API} from "../config";

class OptionList{
    typeId:number;
    fieldName:string;
}

@Injectable()
export class UtilService{

    constructor(
        private http: HttpClient
    ){}

    //判断对象是否为空,true:为空
    isEmptyObj(e) {for (let t in e)return !1;return !0 };

    //处理field的name，“_”去掉，并后一个字母大写
    convertFiledName(filedName){
        while(filedName.indexOf("_")>=0){
            let pos = filedName.indexOf("_");
            if(pos>=0){
                let second_name = filedName[pos+1].toUpperCase();
                filedName = filedName.substring(0, pos)+second_name+filedName.substring(pos+2);
            }
        }
        return filedName;
    }

    //数组删除指定值
    delArrVal(arr:Array<any>,val:any){
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    //获取模块权限
    getAuth(moduleName,comp){
        this.http
            .post(API.getAuth,$.param({moduleName:moduleName}),{headers: API.form})
            .subscribe((data:any)=>{
                if(!this.isEmptyObj(data.result)){
                    comp.auth = data.result;
                }
            });
    }

    //获取下拉列表
    getMoreSelectList(comp, ...optArr: OptionList[]){
        if(!optArr.length)return;
        for(let opt of optArr){
            let typeId = opt.typeId;
            let fieldName = opt.fieldName;
            this.http
                .post(API.getSelectList,$.param({typeId:typeId}),{headers: API.form })
                .subscribe((data:any)=>{
                    comp[fieldName] = data.result;
                });
        }
    }

    getSelectList(typeId, fieldList:string|Array<string>, comp){
        let list = fieldList;
        if(typeof list === "string"){
            list = list.split(",");
        }
        for(let filed of list){
            this.http
                .post(API.getSelectList,$.param({typeId:typeId}),{headers: API.form })
                .subscribe((data:any)=>{
                    comp[filed] = data.result;
                });
        }
    }

    //每个单词的首字母大写
    getLowerCase(str){
        return str.toLowerCase().split(/\s+/).map(function(item, index) {
            return item.slice(0, 1).toUpperCase() + item.slice(1);
        }).join(' ');
    }


}
