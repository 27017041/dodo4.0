/**
 * Created by Carson on 2018/5/25.
 */
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormBuilder, FormGroup, FormArray,NgForm, Validators} from '@angular/forms';
import {QuotationItem} from '../quotation'


@Component({
    selector: 'dialog-quotation',
    templateUrl: './dialog-quotation.component.html'
})
export class DialogQuotationComponent implements OnInit {
    globalLabel: any;
    moduleLabel: any;
    pageType: string;
    page: string;
    
    quoItemData:QuotationItem = new QuotationItem();
    
    @ViewChild('quoItemForm') quoItemForm: NgForm;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<DialogQuotationComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    
    initQuoItem(){
        if (this.data.quoItemData) {
            this.quoItemData = this.data.quoItemData;
        }
    }
    
    initQuoFooter(){
        
    }

    ngOnInit() {
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        this.pageType = this.data.pageType;

        this.page = this.data.page;
        switch (this.page){
            case 'quoItem':
                this.initQuoItem();
                break;
            case 'quoFooter':
                this.initQuoFooter();
                break;
        }
    }
}