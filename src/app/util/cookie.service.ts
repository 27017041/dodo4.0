/**
 * Created by Leo on 2017/10/23.
 */
import { Injectable,Inject } from '@angular/core';
@Injectable()
export class CookieService{
    path:string;
    domain:string

    constructor(){
        this.path = "/";
        this.domain = window.document.location.hostname;
    }

    setCookie(name:string,value:any,
              path:string = this.path,
              domain:string = this.domain){
        let exp = new Date();
        const days = 7;
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        document.cookie = name + "=" + encodeURIComponent(value)
            + ";expires=" + exp.toUTCString()
            + ";path=" + path
            + ";domain=" + domain;

    }

    getCookie(name:string){
        let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    }

    delCookie(name:string,
              path:string = this.path,
              domain:string = this.domain){
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let value = this.getCookie(name);
        if(value != null){
            document.cookie = name + "=" + encodeURIComponent(value)
                + ";expires=" + exp.toUTCString()
                + ";path=" + path
                + ";domain=" + domain;
        }
    }


}
