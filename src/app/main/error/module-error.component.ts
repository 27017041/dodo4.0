/**
 * Created by Leo on 2018/1/10.
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';

@Component({
    selector: 'module-error',
    templateUrl: './module-error.component.html'
})

export class ModuleErrorComponent implements OnInit{
    @Input() ctrl:FormControl;
    @Input() field;
    @Input() globalLabel;
    @Input() moduleLabel;

    constructor(){}

    ngOnInit() {


    }

}
