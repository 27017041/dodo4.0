import {Directive, ElementRef, AfterViewInit,Input,Output,EventEmitter,Renderer2} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';


@Directive({selector: '[tabs-close]'})

export class TabsCloseDirective implements AfterViewInit {
    el: ElementRef;
    @Output() onClear = new EventEmitter<number>();
    @Input() index:number;

    constructor(el: ElementRef, private renderer2: Renderer2) {
        this.el = el;
    }

    ngAfterViewInit() {
        const clearEl = this.renderer2.createElement("i");
        const clearText = this.renderer2.createText("clear");
        this.renderer2.appendChild(clearEl,clearText);
        this.renderer2.setAttribute(clearEl, "class", "material-icons icon-has-ul m-l-05");
        this.renderer2.setStyle(clearEl, "font-size", "initial");
        this.renderer2.setStyle(clearEl, "position", "absolute");
        this.renderer2.setStyle(clearEl, "right", "0");
        this.renderer2.appendChild(this.el.nativeElement,clearEl);
        const removeClick = this.renderer2.listen(clearEl,"click",(event: any)=>{
            event.preventDefault();
            this.onClear.emit(this.index);
            removeClick();//取消监听
        })


    }
}
