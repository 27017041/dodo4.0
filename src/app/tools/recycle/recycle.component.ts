/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";
import {DatatableService} from "../../datatable/datatable.service";
import {RecycleApi} from "./recycle";

@Component({
    selector: 'my-recycle',
    templateUrl: './recycle.component.html'
})
export class RecycleComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;

    @ViewChild(DataTableDirective) dtElement: DataTableDirective; // 表格实例
    dtOptions: any;// 表格的配置
    hasDtInstance:boolean = false;//防止table多次实例化

    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }

    constructor(
        private dt:DatatableService,
        private label:LabelService,
        private util:UtilService
    ) { }


    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('recycle',this);
    }

    getAuth(){
        this.util.getAuth('recycle',this);
    }





    setGrid(){
       this.dtOptions = this.dt.setGrid(
            {
                hasSelect:true,
                hasLink:true,
                ajax:{
                    url: RecycleApi.getList
                },
                columns:[
                    {data:"objTitle",name:"objTitle"},
                    {data:"userName",name:"userName"},
                    {data:"typeName",name:"typeName"},
                    {data:"createDate",name:"createDate"}
                ]
            },
            this
        )

    }


    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.setGrid();
    }

}