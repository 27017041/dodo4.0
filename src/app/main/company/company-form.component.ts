/**
 * Created by Leo on 2017/11/28.
 */
import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter,  ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {LogService} from "../../util/log.service";
import {Company} from "./company";
import {CompanyService} from "./company.service";


@Component({
    selector: 'my-company-form',
    templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit {
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() roleList:any;
    @Input() statusList:any;
    @Input() companyData:Company;
    @Output() onReload = new EventEmitter<boolean>();
    @ViewChild('companyForm') companyForm: NgForm;

    oldCompanyData:Company;

    constructor(
        private log:LogService,
        private cs:CompanyService
    ) { }

    onReset(){
        if(this.pageType == "add"){
            this.companyForm.onReset();
        }else if(this.pageType == "detail"){
            this.companyForm.reset(this.oldCompanyData );
        }
    }

    onSave(){
        if(this.pageType == "add"){
            this.cs.onSave(this);
        }else if(this.pageType == "detail"){
            const fb = this.onPrepareSave();
            this.cs.onSave(this,fb);
        }
    }

    onPrepareSave(){
        let fb:any = {};
        let cd:Company = Object.assign({},this.companyData);
        fb.changeFields = this.log.setLog(new Company().getField(),this.companyData,this.oldCompanyData,this.moduleLabel["text"]);
        fb.formData = JSON.stringify(cd);
        return fb;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['companyData']){
            if(changes['companyData'].currentValue){
                this.companyData = changes['companyData'].currentValue;
            }else{
                this.companyData = new Company();
            }
        }else{
            this.companyData = new Company();
        }
        this.oldCompanyData = Object.assign({}, this.companyData);
        this.onReset();
    }

    ngOnInit() {

    }

}