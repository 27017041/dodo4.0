/**
 * Created by Leo on 2018/1/12.
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl,Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Component({
    selector: 'module-autocomplete',
    templateUrl: './autocomplete.component.html'
})
export class ModuleAutocompleteComponent implements OnInit {
    @Input() ctrl:FormControl;
    @Input() optionList;
    @Input() field;
    @Input() type;
    @Input() globalLabel;
    @Input() moduleLabel;

    filteredOptions: Observable<any>;

    constructor() { }

    getDisplayFn() {
        return (val:any) => {
            let optionName:string;
            for(let opt of this.optionList){
                if(val == opt.optionId){
                    optionName = opt.optionName;
                }
            }
            return optionName;
        };
    }

    filter(val: string): string[] {
        return this.optionList.filter(option =>{
            if(typeof val == "string"){
                let flag = false;
                if(option['optionName'].toLowerCase().indexOf(val.toLowerCase()) === 0){
                    flag = true;
                    for(let opt of this.optionList){
                        if(val == opt.optionName){
                            this.ctrl.setValue(opt.optionId);
                        }
                    }
                }
                return flag;
            }else if(typeof val == "number" || typeof val == "object"){
                return true;
            }else{
                return false;
            }
        });
    }

    ngOnInit() {
        if(this.type == "form"){
            this.ctrl.setValidators(filterValidator(this))
        }
        this.filteredOptions =  this.ctrl.valueChanges.pipe(
            startWith(''),
            map(val => this.filter(val))
        );
    }

}

//autocomplete validator
export function filterValidator(comp): ValidatorFn {
    const optionList = comp.optionList;
    return (control: AbstractControl): {[key: string]: any} => {
        let flag = false;
        for(let opt of optionList){
            if(typeof control.value == "string"){
                if(opt.optionName == control.value){
                    flag = true;
                }
            }else if(typeof control.value == "object" && control.value != null){
                if(opt.optionName == control.value.optionName){
                    flag = true;
                }
            }else if(typeof control.value == "number"){
                flag = true;
            }
        }
       return flag?null:{"autocomplete":true};
    };
}
