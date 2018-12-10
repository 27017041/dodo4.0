import { Component, Input, OnInit } from '@angular/core';
import { APPCONFIG } from '../../config';
import { LayoutService } from '../layout.service';
import {CookieService} from "../../util/cookie.service";

@Component({
    selector: 'my-app-customizer',
    templateUrl: './customizer.component.html',
    styleUrls:['./customizer.component.css']
})

export class AppCustomizerComponent implements OnInit {

    public AppConfig: any;

    constructor(
        private layoutService: LayoutService,
        private cookie:CookieService
    ) {}

    onLangChange(){
        this.cookie.setCookie("x-lang",this.AppConfig.language);
        window.location.reload(true);
    }

    ngOnInit() {
        this.AppConfig = APPCONFIG;
        APPCONFIG.language = this.cookie.getCookie("x-lang")?this.cookie.getCookie("x-lang"):"en";
    }

    onLayoutChange = () => {
        this.layoutService.updateEChartsState(true);
    }
  }
