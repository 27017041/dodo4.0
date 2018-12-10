/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {Relational} from "../module-config";


@Component({
    selector: 'dialog-add-relational',
    templateUrl: './dialog-add-relational.component.html'
})
export class DialogAddRelationalComponent implements OnInit{
    globalLabel:any;
    moduleLabel:any;
    moduleList:any;
    relationalData = new Relational();

    constructor(
        public dialogRef: MatDialogRef<DialogAddRelationalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(){
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        this.moduleList = this.data.moduleList;

    }
}