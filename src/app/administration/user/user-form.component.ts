/**
 * Created by Leo on 2017/11/28.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter,  ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LogService} from "../../util/log.service";
import {User} from "./user";
import {UserService} from "./user.service";
import {UtilService} from "../../util/util.service";


@Component({
    selector: 'my-user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit,AfterViewInit {
    @Input() globalLabel:any;//required
    @Input() moduleLabel:any;//required
    @Input() pageType:string;//required
    @Input() keyId:any;//required
    @Output() onReload = new EventEmitter<boolean>();//required
    @ViewChild("detailForm") detailForm:NgForm;//required

    formData:User;//required
    oldFormData:User;//required

    roleList:any[];
    statusList:any[];
    
    constructor(
        private log:LogService,
        private util:UtilService,
        private us:UserService
    ) { }

    getSelectList(){
        this.util.getSelectList(3,"statusList",this);
        this.us.getRoleList(this);
    }

    getDetail(){
        this.us.getDetail(this);
    }

    onPrepare(){
        let fb:any = {};
        let ud:User = Object.assign({},this.formData);
        ud.roleId = ud.roleId.toString();
        fb.changeFields = this.log.setLog(new User().getField(),this.formData,this.oldFormData,this.moduleLabel["text"]);
        fb.formData = JSON.stringify(ud);
        return fb;
    }
    
    onAdd(){
        const fb = this.onPrepare();
        this.us.onAdd(fb,this);
    }

    onUpdate(){
        const fb = this.onPrepare();
        this.us.onUpdate(fb,this);
    }
    
    onReset(){
        if(this.pageType == "add"){
            this.detailForm.onReset();
        }else if(this.pageType == "detail"){
            this.detailForm.reset(this.oldFormData );
            setTimeout(()=>{
                this.formData.roleId = this.oldFormData.roleId; // 恢复多选的值
            })
        }
    }
    

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['pageType']){
            if(changes['pageType'].currentValue == "add"){
                this.formData = new User();
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