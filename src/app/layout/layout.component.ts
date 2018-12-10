import { Component,OnInit } from '@angular/core';
import {SessionService} from "../util/session.service";

@Component({
    selector: 'my-app-layout',
    templateUrl: './layout.component.html',
})
export class LayoutComponent implements  OnInit{

    constructor(
        private session : SessionService
    ){}


    ngOnInit(){
        this.session.getUser();
    }
}
