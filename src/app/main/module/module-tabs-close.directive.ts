import {Directive, ElementRef, AfterViewInit,Input,Output,EventEmitter} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';


@Directive({selector: '[moduleTabsClose]'})

export class ModuleTabsCloseDirective implements AfterViewInit {
    el: ElementRef;
    @Output() onClear = new EventEmitter<number>();
    @Input() index:number;
    constructor(el: ElementRef) {
        this.el = el;
    }

    ngAfterViewInit() {
        const $tabLabel = $(this.el.nativeElement);
        const $body = $('#body');

        setTimeout(()=>{
            $(".mat-tab-label-active").append('<i class="material-icons icon-has-ul" style="font-size: initial;margin-left: .5rem;">clear</i>');
            $(".mat-tab-label-active i").on('click', (e) => {
                e.preventDefault();
                this.onClear.emit(this.index);
            })
        },100)



    }
}
