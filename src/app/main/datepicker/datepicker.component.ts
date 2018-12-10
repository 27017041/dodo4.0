/**
 * Created by Leo on 2018/1/10.
 */
import { Component, Input } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { FormGroup,FormControl } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY-MM-DD',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY-MM',
        dateA11yLabel: 'DD',
        monthYearA11yLabel: 'YYYY-MM',
    },
};


@Component({
    selector: 'module-datepicker',
    templateUrl: './datepicker.component.html',
    providers:[
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})

export class ModuleDatepickerComponent{
    @Input() ctrl:FormControl;
    @Input() globalLabel;
    @Input() moduleLabel;
    @Input() field;
    @Input() type;

    constructor(){}

    onChange(date){
        this.ctrl.setValue(moment(date.value).format('YYYY-MM-DD'))
    }


}
