/**
 * Created by Leo on 2017/11/28.
 */
import { Directive, ElementRef, AfterViewInit  } from '@angular/core';

@Directive({
    selector: '[minheight]',
})

export class MinheightDirective implements AfterViewInit {

    constructor(private el: ElementRef) {}

    ngAfterViewInit(){
        const appHeader = $('.app-header').height()?$('.app-header').height():0;
        const appFooter = $('.app-footer').height()?$('.app-footer').height():0;
        const sidebarHeader = $('.sidebar-content').height()?$('.sidebar-content').height():0;
        const tabsContent = sidebarHeader - appHeader - appFooter - 14;
        this.el.nativeElement.style.minHeight = tabsContent + "px";
    }
 
}
