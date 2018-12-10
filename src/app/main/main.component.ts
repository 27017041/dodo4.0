/**
 * Created by Leo on 2017/11/23.
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector:'my-main',
    template:`<router-outlet></router-outlet>`
})
export class MainComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}