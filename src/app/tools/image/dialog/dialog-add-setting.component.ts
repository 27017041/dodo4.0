/**
 * Created by Leo on 2017/11/23.
 */
import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {ImageSetting} from "../image";


@Component({
    selector: 'dialog-add-setting',
    templateUrl: './dialog-add-setting.component.html'
})
export class DialogAddSettingComponent implements OnInit {
    globalLabel: any;
    moduleLabel: any;
    pageType: string;
    setting: ImageSetting = new ImageSetting();
    settingForm: FormGroup;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<DialogAddSettingComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        if (this.data.setting) {
            this.setting = this.data.setting;
        }

        this.settingForm = this.fb.group({
            confName: [this.setting.confName, [Validators.required]],
            width: [this.setting.width, [Validators.required,Validators.pattern("[0-9]*")]],
            height: [this.setting.height, [Validators.required,Validators.pattern("[0-9]*")]],
            quality: [this.setting.quality, [Validators.required, Validators.min(1), Validators.max(100),Validators.pattern("[0-9]*")]]
        })
    }
}