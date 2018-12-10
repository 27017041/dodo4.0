/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LabelService} from "../../util/label.service";
import {AssignService} from "./assign.service";
import {UtilService} from "../../util/util.service";
import {Assign} from "./assign";

@Component({
    selector: 'my-role',
    templateUrl: './assign.component.html'
})
export class AssignComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;
    roleList:any;
    menuList:any;
    rightData:any;
    @ViewChild("assignForm") assignForm:NgForm;

    auth = {
        rightDelete:0,
        rightInsert:0,
        rightRead:0,
        rightUpdate:0
    }
    assign = new Assign();

    constructor(
        private label:LabelService,
        private as:AssignService,
        private util:UtilService
    ) { }

    getLabel(){
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('assign',this);
    }

    getAuth(){
        this.util.getAuth('assign',this);
    }

    getRoleList(){
       this.as.getRoleList(this);
    }

    @HostListener("document:keydown",["$event"])
    onKeydown(e){
        if(e.key == "Enter" && this.assignForm.form.valid){
            this.onSearch();
        }
    }

    onSearch(){
        this.as.getRoleMap(this);
    }

    onSelectAll(menu){
        menu['delete'] = menu.all;
        menu['insert'] = menu.all;
        menu['read'] = menu.all;
        menu['update'] = menu.all;
    }

    onSave(){
        this.as.onSave(this);
    }

    ngOnInit() {
        this.getLabel();
        this.getAuth();
        this.getRoleList();

    }

}