import { Component, OnInit } from '@angular/core';
import {MenuService} from "../../../util/menu.service";
import {LabelService} from "../../../util/label.service";
import {LayerService} from "../../../layer/layer.service";
import {SessionService} from "../../../util/session.service"

@Component({
    selector: 'my-app-sidenav-menu',
    styles: [],
    templateUrl: './sidenav-menu.component.html'
})

export class AppSidenavMenuComponent implements OnInit{
    menuList:any;
    globalLabel:any;
    isComplete = false;

    constructor(
        private label:LabelService,
        private layer:LayerService,
        private menu:MenuService,
        private session:SessionService
    ){}

    getLabel(){
        this.label.getGlobalLabel(this);
    }

    getMenuList(){
        this.menu.getMenuList(this);
    }

    logout(){
        const dialogRef = this.layer.alert(this.globalLabel['tips']['logoutTip'])
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.session.logout(this);
            }
        });
    }

    ngOnInit(){
        this.getLabel();
        this.getMenuList();
    }
}
