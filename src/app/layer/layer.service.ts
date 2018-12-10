/**
 * Created by Leo on 2017/11/30.
 */
import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LayerComponent} from "./layer.component";

class LayerOptions{
    type:string;
    text:string;
    time?:number
}

@Injectable()
export class LayerService{
    globalLabel:any;

    constructor(
        private dialog:MatDialog
    ) { }

    loading(){
        return this.dialog.open(
            LayerComponent, { disableClose:true, data:{type:"loading"} } //disableClose:true 点击遮罩层不会关闭
        )
    }

    msg(options:LayerOptions,callback?){
        this.dialog.open(
            LayerComponent, { hasBackdrop:false, data:options}
        )
        setTimeout(()=>{
            if (typeof callback === "function"){
                callback();
            }
        },options.time?options.time:2100)
    }

    alert(text){
        return this.dialog.open(
            LayerComponent, { disableClose:true, data:{type:"alert",text:text} }
        )
    }


}