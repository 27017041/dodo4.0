/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {LogService} from "../../util/log.service";

import { ListConfigService} from "./list-config.service";
import {ListItemOption, ListItem} from "./list-config";

@Component({
    selector: 'my-list-item-form',
    templateUrl: './list-config-form.component.html'
})
export class ListConfigFormComponent{
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() listItemOptData:ListItemOption;
    @Input() listItem:ListItem;
    @Input() moduleList:any;
    @Output() onReload = new EventEmitter<boolean>();
    @ViewChild("optForm") optForm:NgForm;

    oldListItemOptData:ListItemOption;
    optKeyList = ["text", "tips"];

    constructor(
        private log:LogService,
        private lcs:ListConfigService
    ) { }

    onReset(){
        if(this.pageType == "add"){
            this.optForm.onReset();
        }else if(this.pageType == "detail"){
            this.optForm.reset(this.oldListItemOptData );
        }
    }

    onSaveOpt(){
        this.listItemOptData.typeId = this.listItem.typeId;
        this.listItemOptData.sort = this.listItem.typeId;
        this.lcs.onSaveOpt(this);
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['listItemOptData']){
            if(changes['listItemOptData'].currentValue){
                this.listItemOptData = changes['listItemOptData'].currentValue;
            }else{
                this.listItemOptData = new ListItemOption();
            }
        }else{
            this.listItemOptData = new ListItemOption();
        }
        this.optForm.reset(this.listItemOptData);
        this.oldListItemOptData = Object.assign({}, this.listItemOptData);
    }


}