/**
 * Created by Leo on 2017/11/24.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LabelService} from "../util/label.service"

@Component({
    selector: 'my-dialog',
    templateUrl: 'layer.component.html'
})
export class LayerComponent implements OnInit {
    globalLabel:any;

    constructor(
        public dialogRef: MatDialogRef<LayerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public label:LabelService
    ) {}

    getLabel(){
        this.globalLabel = this.label.globalLabel;
    }

    ngOnInit() {
        this.getLabel();
        if(this.data.type.indexOf("msg") > -1){
            setTimeout(()=>{
                this.dialogRef.close(); //close loading
            },this.data.time?this.data.time:2100)
        }
    }

}