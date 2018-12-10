import { Component, OnInit } from '@angular/core';
import {LabelService} from "../../util/label.service";
import {UtilService} from "../../util/util.service";

@Component({
    selector: 'my-contact',
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
    globalLabel:any;
    moduleLabel:any;

    selectedIndex:number = 0;//tabs 切换
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

    //切换tabs
    onTabsChange(tabs) {
        this.selectedIndex = tabs.index;
    }
    onIndexChange(index:number){
        this.selectedIndex = index;
    }

    getLabel() {
        this.label.getGlobalLabel(this);
        this.label.getModuleLabel('contact', this);
    }

    getAuth(){
        this.util.getAuth('contact',this);
    }


    ngOnInit() {
        this.getLabel();
        this.getAuth();
    }

}