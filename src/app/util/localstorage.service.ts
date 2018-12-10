/**
 * Created by Leo on 2017/9/27.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService{
    ls = window.localStorage;

    constructor(
    ){}

    /**Set**/
    set(key:string, value:any){
        if(typeof value === "object"){
            if(value instanceof Object){
                let obj:Object = {"ls_object":value};
                this.ls.setItem(key,JSON.stringify(obj));
            }
        }else if(typeof value !== "object" && typeof value !== "function"){
            this.ls.setItem(key,encodeURI(value));
        }else{
            this.ls.setItem(key,"");
        }
    }

    /**Get**/
    get(key:string){
        let obj:any;
        let value:any = this.ls.getItem(key);
        if(value !== undefined){
            if(value.indexOf("ls_object") > -1){
                obj = JSON.parse(value["ls_object"]);
            }else if(typeof value !== "object" && typeof value !== "function"){
                obj = decodeURI(value["ls_object"]);
            }else{
                obj = "";
            }
        }
        return obj;
    }

    /**Remove**/
    remove(key:string){
        this.ls.removeItem(key);
    }

    /**Remove All**/
    removeAll(){
        this.ls.clear();
    }
}
