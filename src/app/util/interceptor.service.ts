/**
 * Created by Leo on 2017/9/27.
 */
import { Injectable } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse  } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import {CookieService} from "./cookie.service";

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

    constructor(
        private router:Router,
        private cookie: CookieService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /*let url = req.url;
        if(url.indexOf('.json') > -1){
            return next.handle(req);
        }else{
            let sessionId = window.localStorage.getItem('sessionId');
            if(url.indexOf('?') > -1){
                url = url.replace('?', (';jsessionid='+ sessionId + '?'))
            }else{
                url = url + ';jsessionid=' + sessionId;
            }
            const dupReq = req.clone({ url: url});
            return next.handle(dupReq);
        }*/
        let uid = this.cookie.getCookie("uid");
        let token = this.cookie.getCookie("x-auth-token");
        let lang = this.cookie.getCookie("x-lang")?this.cookie.getCookie("x-lang"):"en";

        let hreq = req.headers;
        if(uid){
            hreq = hreq.set("uid",uid);
        }
        if(token){
            hreq = hreq.set('x-auth-token',token)
        }
        if(lang){
            hreq = hreq.set('x-lang',lang)
        }
        const authReq = req.clone({headers: hreq});
        return next.handle(authReq).do(event => {
            if (event instanceof HttpResponse) {
                if(event.body.error == "401"){
                    this.router.navigate(['/extra/login']);
                }
            }
        });
    }
}
