/**
 * Created by Carson on 2018/5/10.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter,  ViewChild, ElementRef } from '@angular/core';
import {LogService} from "../../util/log.service";
import {TaskLog} from "./task-log";
import {TaskLogService} from "./task-log.service";


@Component({
    selector: 'task-log-form',
    templateUrl: './task-log-form.component.html'
})
export class TaskLogFormComponent implements OnInit {
    
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() taskLogData:TaskLog;
    @Output() onReload = new EventEmitter<boolean>();

    oldTaskLogData:TaskLog;

    constructor(
        private log:LogService,
        private us:TaskLogService
    ) { }

    // onReset(){
    //     if(this.pageType == "add"){
    //         this.userForm.onReset();
    //     }else if(this.pageType == "detail"){
    //         this.userForm.reset(this.oldTaskLogData );
    //         setTimeout(()=>{
    //             // 恢复多选的值
    //             this.taskLogData.logId = this.oldTaskLogData.logId;
    //         },1)
    //     }
    // }

    // onPrepareSave(){
    //     let fb:any = {};
    //     let ud:TaskLog = Object.assign({},this.taskLogData);
    //     ud.logId = ud.logId.toString();
    //     fb.changeFields = this.log.setLogData(this.taskLogData,this.oldTaskLogData,this.moduleLabel["text"]);
    //     fb.formData = JSON.stringify(ud);
    //     return fb;
    // }

    ngOnInit() {
        
    }

}