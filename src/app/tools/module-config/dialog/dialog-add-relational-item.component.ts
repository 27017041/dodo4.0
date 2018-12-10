/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {Relational, RelationalItem} from "../module-config";


@Component({
    selector: 'dialog-add-relational-item',
    templateUrl: './dialog-add-relational-item.component.html'
})
export class DialogAddRelationalItemComponent implements OnInit{
    globalLabel:any;
    moduleLabel:any;
    relationalItemData = new RelationalItem();
    tableFieldsList:any;
    pageType:string;

    constructor(
        public dialogRef: MatDialogRef<DialogAddRelationalItemComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(){
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        this.tableFieldsList = this.data.tableFieldsList;
        this.pageType = this.data.pageType;

        if(this.pageType == "add"){
            this.relationalItemData.relationalId = this.data.relational.id;
            this.relationalItemData.isLink = 0;
            this.relationalItemData.isDelete = 0;
            this.relationalItemData.isHistory = 0;
            this.relationalItemData.isDisplay = 1;
        }else if(this.pageType == "update"){
            this.relationalItemData = this.data.relationalItem;
        }
    }
}