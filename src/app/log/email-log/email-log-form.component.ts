/**
 * Created by Carson on 2018/5/10.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter,AfterViewInit} from '@angular/core';
import {UtilService} from "../../util/util.service";
import {EmailLogService} from "./email-log.service";
import {EmailLog} from "./email-log";

@Component({
    selector: 'my-email-log-form',
    templateUrl: './email-log-form.component.html'
})
export class EmailLogFormComponent implements OnInit,AfterViewInit {
    @Input() globalLabel:any;//required
    @Input() moduleLabel:any;//required
    @Input() pageType:string;//required
    @Input() keyId:any;//required
    @Output() onReload = new EventEmitter<boolean>();//required

    formData:EmailLog;//required
    oldFormData:EmailLog;//required

    statusList:any[] = [];
    logTypeList:any[] = [];

    constructor(
        private util:UtilService,
        private els:EmailLogService
    ) { }

    getSelectList(){
        this.util.getSelectList(16,"logTypeList",this);
        this.util.getSelectList(17,"statusList",this);
    }

    getDetail(){
        this.els.getDetail(this);
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
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