import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({ selector: '[myAppendSubmenuIcon]' })

export class AppendSubmenuIconDirective implements AfterViewInit {
    el: ElementRef;
    constructor(el: ElementRef) {
      this.el = el;
    }

    ngAfterViewInit() {
        const $el = $(this.el.nativeElement);
        const interval = setInterval(()=>{
            if($el.hasClass("complete")){
                clearInterval(interval);
                $el.find('.prepend-icon').prepend('<i class="material-icons">keyboard_arrow_right</i>');
            }
        },500);
    }
}
