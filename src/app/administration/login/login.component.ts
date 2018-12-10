/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";

@Component({
    selector: 'my-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;

    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }

    constructor(
        private label:LabelService,
        private util:UtilService
    ) { }


    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('login',this);
    }

    getAuth(){
        this.util.getAuth('login',this);
    }
    
    ngOnInit() {
        this.getLabel();
        this.getAuth();
    }

}