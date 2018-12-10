/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";

@Component({
    selector: 'my-registration',
    templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {
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
        this.label.getModuleLabel('registration',this);
    }

    getAuth(){
        this.util.getAuth('registration',this);
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
    }

}