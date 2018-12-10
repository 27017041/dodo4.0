import { Component, OnInit } from '@angular/core';
import {LabelService} from "../../util/label.service";
import {LoginService} from "./login.service";
import {Login} from "./login";

@Component({
    selector: 'my-page-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})

export class PageLoginComponent implements OnInit{
    globalLabel:any;
    login = new Login();


    constructor(
        private label: LabelService,
        private loginService : LoginService
    ){}

    getLabel(){

        this.label.getGlobalLabelFormSignIn(this);
    }

    onLogin(){
        this.loginService.login(this);
    }

    ngOnInit(){
        this.getLabel();
    }
}
