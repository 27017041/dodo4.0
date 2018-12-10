/**
 * Created by Leo on 2017/11/28.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {LogService} from "../../util/log.service";
import {Scheduler} from "./scheduler";
import {SchedulerService} from "./scheduler.service";

@Component({
    selector: 'my-scheduler-form',
    templateUrl: './scheduler-form.component.html'
})
export class SchedulerFormComponent implements OnInit {
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() schedulerData:Scheduler;
    @Output() onReload = new EventEmitter<boolean>();
    @ViewChild('schedulerForm') schedulerForm:NgForm;
    oldSchedulerData:Scheduler;

    typeList = ["Month","Week"];
    schedulerType:String;

    monthDayList = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
        "21","22","23","24","25","26","27","28","29","30","31"];

    weekDayList = ["1","2","3","4","5","6","7"];

    hourDayList = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
        "21","22","23","24"];

    minuteHourList = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
        "21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41",
        "42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"];

    constructor(
        private log:LogService,
        private ss:SchedulerService
    ) { }

    onReset(){
        if(this.pageType == "add"){
            this.schedulerForm.onReset();
        }else if(this.pageType == "detail"){
            this.schedulerForm.reset(this.oldSchedulerData );
            setTimeout(()=>{
                if(this.schedulerData.monthDay){
                    this.schedulerType = "Month";
                }else{
                    this.schedulerType = "Week";
                }
                this.schedulerData.monthDay = this.oldSchedulerData.monthDay;
                this.schedulerData.weekDay = this.oldSchedulerData.weekDay;
                this.schedulerData.hourDay = this.oldSchedulerData.hourDay;
                this.schedulerData.minuteHour = this.oldSchedulerData.minuteHour;
            },1)
        }
    }

    onSave(){
        const fb = this.onPrepareSave();
        this.ss.onSave(fb,this);
    }

    onPrepareSave(){
        let fb:any = Object.assign({},this.schedulerData);
        if(this.schedulerType == "Month"){
            delete this.schedulerData.weekDay;
            fb.monthDay = this.schedulerData.monthDay.toString();
        }else if(this.schedulerType == "Week"){
            delete this.schedulerData.monthDay;
            fb.weekDay = this.schedulerData.weekDay.toString();
        }
        fb.hourDay = this.schedulerData.hourDay.toString();
        fb.minuteHour = this.schedulerData.minuteHour.toString();
        return fb;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['schedulerData']){
            if(changes['schedulerData'].currentValue){
                this.schedulerData = changes['schedulerData'].currentValue;
            }else{
                this.schedulerData = new Scheduler();
            }
        }else{
            this.schedulerData = new Scheduler();
        }
        this.oldSchedulerData = Object.assign({}, this.schedulerData);
        this.onReset();

    }

    ngOnInit() {

    }

}