/**
 * Created by Leo on 2017/11/28.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild,AfterViewInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {Role} from "./role";
import {LogService} from "../../util/log.service";
import {RoleService} from "./role.service";
import {UtilService} from "../../util/util.service";

@Component({
    selector: 'my-role-form',
    templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit,AfterViewInit {
    @Input() globalLabel:any;//required
    @Input() moduleLabel:any;//required
    @Input() pageType:string;//required
    @Input() keyId:any;//required
    @Output() onReload = new EventEmitter<boolean>();//required
    @ViewChild("detailForm") detailForm:NgForm;//required

    formData:Role;//required
    oldFormData:Role;//required

    statusList:any[] = [];

    constructor(
        private log:LogService,
        private util:UtilService,
        private rs:RoleService
    ) { }

    getSelectList(){
        this.util.getSelectList(1, "statusList", this);
    }

    getDetail(){
        this.rs.getDetail(this);
    }
    
    onPrepare(){
        let fb:any = {};
        let rd:Role = Object.assign({},this.formData);
        fb.changeFields = this.log.setLog(new Role().getField(),this.formData,this.oldFormData,this.moduleLabel["text"]);
        fb.formData = JSON.stringify(rd);
        return fb;
    }

    onAdd(){
        const fb = this.onPrepare();
        this.rs.onAdd(fb,this);
    }

    onUpdate(){
        const fb = this.onPrepare();
        this.rs.onUpdate(fb,this);
    }

    onReset(){
        if(this.pageType == "add"){
            this.detailForm.onReset();
        }else if(this.pageType == "detail"){
            this.detailForm.reset(this.oldFormData );
        }
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['pageType']){
            if(changes['pageType'].currentValue == "add"){
                this.formData = new Role();
                this.oldFormData = Object.assign({}, this.formData);

            }
        }

        if(changes['keyId']){
            if(changes['keyId'].currentValue){
                this.keyId = changes['keyId'].currentValue;
            }
        }
    }

    ngOnInit() {
        this.getSelectList();
    }

    ngAfterViewInit(){
        setTimeout(() => {
            if(this.keyId){
                this.getDetail();
            }
        },500);
    }
}