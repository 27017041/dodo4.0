/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {ModuleField} from "../module-config";


@Component({
    selector: 'dialog-add-config',
    templateUrl: './dialog-add-config.component.html'
})
export class DialogAddConfigComponent implements OnInit{
    type:string;
    globalLabel:any;
    moduleLabel:any;
    fieldList:Array<ModuleField>;
    selectedField:any;

    constructor(
        public dialogRef: MatDialogRef<DialogAddConfigComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(){
        this.type = this.data.type;
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        this.fieldList = this.data.fieldList;
    }
}