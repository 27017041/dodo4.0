import { HttpHeaders  } from '@angular/common/http';

function makeAppConfig() {
    const date = new Date();
    const year = date.getFullYear();

    const AppConfig = {
        brand: 'DODO4.0',
        user: 'Lisa',
        year,
        layoutBoxed: false,               // true, false
        navCollapsed: false,              // true, false
        navBehind: false,                 // true, false
        fixedHeader: true,                // true, false
        sidebarWidth: 'middle',           // small, middle, large
        theme: 'light',                   // light, gray, dark
        colorOption: '34',                // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        AutoCloseMobileNav: true,         // true, false. Automatically close sidenav on route change (Mobile only)
        productLink: 'https://themeforest.net/item/material-design-angular-2-admin-web-app-with-bootstrap-4/19421267',
        language:'en'
    };
    return AppConfig;
}
function getApi(){
    const host = window.document.location.host;
    const hostname = window.document.location.hostname;
    const href = window.document.location.href;
    const pathname = window.document.location.pathname;
    let pos = href.indexOf(pathname);
    let hostPath = href.substring(0,pos);
    let projectName = pathname.substring(0,pathname.substr(1).indexOf('/')+1);

    if(hostname == "localhost"){//开发环境
        return "http://127.0.0.1:8080/dodo40";//"http://www.dodo40.com";
    }else{//打包发布
        return hostPath;
    }
};

export const APPCONFIG = makeAppConfig();

export const API = {
    api:getApi(),
    json: new HttpHeaders().set('Content-Type','application/json;charset=UTF-8'),
    form: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'),
    getAuth:getApi() + "/common/getRightInModule",
    getSelectList:getApi() + "/common/getSelectDataInModule",
}
