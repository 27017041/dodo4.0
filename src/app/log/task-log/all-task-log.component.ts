/**
 * Created by Carson on 2018/5/16.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input,  ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {TaskLog, TaskLogApi} from "./task-log";

import {LogService} from "../../util/log.service";
import {TaskLogService} from "./task-log.service";
import {DatatableService} from "../../datatable/datatable.service";


@Component({
    selector: 'all-task-log',
    templateUrl: './all-task-log.component.html'
})
export class AllTaskLogFormComponent implements OnInit {

    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() statusList:any;

    dtOptions:any;

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;


    constructor(
        private log:LogService,
        private us:TaskLogService,
        private dt:DatatableService
    ) { }

    onSearch(){
        this.dt.onSearch(this);
    }

    setGrid(){
        this.dtOptions = this.dt.setGrid(
            {
                hasSelect:false,
                hasLink:false,
                order:[['0','asc']],
                ajax:{
                    url:TaskLogApi.getList,
                    // data:this.taskLog
                },
                columns:[
                    {keyField:"cronLogId",data:"cronName",name:"cronName"},
                    {data:"status",name:"status"},
                    {data:"startTime",name:"startTime"},
                    {data:"endTime",name:"endTime"},
                    {data:"log",name:"log"},
                    {data:"position",name:"position"}
                ]
            },
            this
        )

    }

    ngOnInit() {
        this.setGrid();
    }

}