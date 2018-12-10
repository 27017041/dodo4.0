/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnChanges, SimpleChange, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {LogService} from "../../util/log.service";
import {Label, LabelType} from "./label-config";
import {LabelConfigService} from "./label-config.service";

@Component({
    selector: 'my-label-form',
    templateUrl: './label-config-form.component.html'
})
export class LabelConfigFormComponent{
    @Input() pageType:string;
    @Input() moduleLabel:any;
    @Input() globalLabel:any;
    @Input() labelDetailData:Label;
    @Input() labelType:LabelType;
    @Output() onReload = new EventEmitter<boolean>();
    @ViewChild('labelForm') labelForm:NgForm;

    oldLabelData:Label;
    labelData:Label;

    constructor(
        private log:LogService,
        private lcs:LabelConfigService
    ) { }

    onReset(){
        if(this.pageType == "add"){
            this.labelForm.onReset();
        }else if(this.pageType == "detail"){
            this.labelForm.reset(this.oldLabelData );
        }
    }

    onSaveLabel(){
        const fb = this.onPrepareSave();
        this.lcs.onSaveLabel(fb,this);
    }

    onPrepareSave(){
        let fb:any = {};
        let ld:Label = Object.assign({},this.labelData);
        let ldata = [
            {
                labelText:ld.labelTextCn,
                lang:"cn",
                module:this.labelType.moduleName,
                labelOrginal:ld.labelOrginal,
                labelType:this.labelType.optionId,
                labelId:null
            },
            {
                labelText:ld.labelTextTc,
                lang:"tc",
                module:this.labelType.moduleName,
                labelOrginal:ld.labelOrginal,
                labelType:this.labelType.optionId,
                labelId:null
            },
            {
                labelText:ld.labelTextEn,
                lang:"en",
                module:this.labelType.moduleName,
                labelOrginal:ld.labelOrginal,
                labelType:this.labelType.optionId,
                labelId:null
            }
        ];
        const ldd = this.labelDetailData;
        for(let l in ldd){
            for(let l2 of ldata){
                if(l2.lang == ldd[l].lang){
                    l2.labelId = ldd[l].labelId;
                }
            }
        }

        fb.confLabelData = JSON.stringify(ldata);
        delete ld.labelTextCn;
        delete ld.labelTextTc;
        delete ld.labelTextEn;

        //fb.changeFields = this.log.setLogData(this.labelData,this.oldLabelData,this.moduleLabel["text"]);
        return fb;
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(changes['labelDetailData']){
            if(changes['labelDetailData'].currentValue){
                this.labelData = new Label();
                const ld = changes['labelDetailData'].currentValue;
                for(let l of ld){
                    if(l.lang == "en"){
                        this.labelData.labelTextEn = l.labelText;
                    }else if(l.lang == "tc"){
                        this.labelData.labelTextTc = l.labelText;
                    }else if(l.lang == "cn"){
                        this.labelData.labelTextCn = l.labelText;
                    }
                    this.labelData.labelType = l.labelType;
                    this.labelData.labelOrginal = l.labelOrginal;
                }
            }else{
                this.labelData = new Label();
            }
        }else{
            this.labelData = new Label();
        }
        this.labelForm.reset(this.labelData);
        this.oldLabelData = Object.assign({}, this.labelData);
    }


}