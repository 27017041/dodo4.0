/**
 * Created by Leo on 2018/1/30.
 */
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router, NavigationExtras} from '@angular/router';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {LayerService} from "../../layer/layer.service";
import {CookieService} from "../../util/cookie.service";
import {API, APPCONFIG} from "../../config";
import {LoginApi} from "./login";

@Injectable()
export class LoginService {

    constructor(private dialog: MatDialog,
                private http: HttpClient,
                private router: Router,
                private layer: LayerService,
                private cookie: CookieService) {
    }

    login(comp) {
        const loading = this.layer.loading();
        this.http
            .post(LoginApi.login, $.param(comp.login), {headers: API.form})
            .subscribe((data: any) => {
                loading.close();
                if (!data.success) {
                    this.layer.msg({type: "msg_danger", text: "User error"});
                } else {
                    this.cookie.setCookie("uid", data.uid);
                    this.cookie.setCookie("x-auth-token", data["x-auth-token"]);
                    this.cookie.setCookie("x-lang", data["x-lang"]);
                    APPCONFIG.language = data["x-lang"] ? data["x-lang"] : "en";
                    if (data.status == 0) {
                        alert("第一次登录强制修改密码 ")
                    } else {
                        this.router.navigate(['/app/dashboard']);
                    }
                }
            }, err => {
                loading.close();
                this.layer.msg({type: "msg_danger", text: comp.globalLabel['tips']['systemErr']});
            });
    }

}