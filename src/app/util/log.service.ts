/**
 * Created by Leo on 2017/11/29.
 */
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import {API} from "../config";
import {UtilService} from "./util.service";

@Injectable()
export class LogService {

    constructor(
        private http: HttpClient,
        private util: UtilService
    ) { }

    //旧的
    setLogData(newData,oldData,text){
        let changeFields = "";
        const setField = (field)=>{
            let newValue = newData[field]==undefined?'null':newData[field];
            let oldValue = oldData[field]==undefined?'null':oldData[field];
            if(newValue instanceof Array){
                newValue = "'" + newValue.toString() + "'";
            }
            if(oldValue instanceof Array){
                oldValue =  "'" + oldValue.toString() + "'";
            }
            if(newValue != oldValue){
                changeFields = changeFields + text[field] + ' changed from ' + oldValue + ' to ' + newValue + ',';
            }
        }

        if(!this.util.isEmptyObj(oldData)){
            if( Object.keys(oldData).length >= Object.keys(newData).length){
                for(let field in oldData){
                    if(field != "constructor"){
                        setField(field)
                    }
                }
            }else{
                for(let field in newData){
                    if(field != "constructor"){
                        setField(field)
                    }
                }
            }
        }else if(!this.util.isEmptyObj(newData)){
            if( Object.keys(newData).length >= Object.keys(oldData).length){
                for(let field in newData){
                    if(field != "constructor"){
                        setField(field)
                    }
                }
            }else{
                for(let field in oldData){
                    if(field != "constructor"){
                        setField(field)
                    }
                }
            }
        }
        if(changeFields != ""){
            changeFields = changeFields.substring(0,changeFields.length-1);
        }

        return changeFields;

    }

    //新的
    setLog(field,newData,oldData,text){
        let changeArr = new Array();
        for(let f of field){
            let oldValue = oldData[f]?oldData[f]:"";
            let newValue = newData[f]?newData[f]:"";

            if(oldValue != newValue){
                let obj = {"description":text[f] + ' changed from ' + oldValue + ' to ' + newValue,"fieldName":f};
                changeArr.push( JSON.stringify(obj) );
            }
        }

        return changeArr.toString();
    }

}