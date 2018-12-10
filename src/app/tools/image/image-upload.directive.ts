/**
 * Created by Leo on 2018/1/24.
 */
import { Directive, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {LabelService} from "../../util/label.service";
import {LayerService} from "../../layer/layer.service";
import {ImageService} from "./image.service";

@Directive({
    selector: '[imageUpload]',
    outputs:['selectImage'],
    host: {
        '(click)': 'onClick($event.target)',
        '(change)': 'onChange($event.target)',
    }
})

export class ImageUploadDirective implements AfterViewInit {
    globalLabel:any;
    fileList:Array<File>;
    selectImage = new EventEmitter();
    multiple:boolean = false;

    constructor(
        private sanitizer: DomSanitizer,
        private el: ElementRef,
        private label: LabelService,
        private layer: LayerService,
        private is: ImageService
    ) {}

    getLabel(){
        this.label.getGlobalLabel(this);
    }

    onClick(e) {
        e.value = "";
    }

    onChange(e){
        this.fileList = e.files;
        for(let file of this.fileList){
            if(file['type'].match(/.(jpg|jpeg|png)$/)==null){
                this.layer.msg({type:"msg_danger",text:this.globalLabel.tips.imgFormatErr})
                break;
            }
            if (file['size'] > 2048000){
                this.layer.msg({type:"msg_danger",text:this.globalLabel.tips.imgSizeErr})
                break;
            }
            if(!this.multiple){
                const fb = new FormData();
                fb.append("image",file);
                this.is.uploadImage(fb,this);
            }
        }

    }

    ngAfterViewInit() {
        this.getLabel();
        const $el = $(this.el.nativeElement);
        if($el.attr("multiple")){
            this.multiple = true;
        }else{
            this.multiple = false;
        }
    }
}