/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {ListItem} from "../list-config";


@Component({
    selector: 'dialog-list-item',
    templateUrl: './dialog-list-item.component.html'
})
export class DialogItemListComponent implements OnInit{
    type:string;
    globalLabel:any;
    moduleLabel:any;
    itemData:ListItem;
    moduleList:any;

    constructor(
        public dialogRef: MatDialogRef<DialogItemListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(){

        this.type = this.data.type;
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        this.moduleList =  this.data.moduleList;

        if(this.type == "add"){
            this.itemData = new ListItem();
        }else if(this.type == "edit"){
            this.itemData = this.data.itemData;
        }
    }
}