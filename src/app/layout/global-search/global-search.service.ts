/**
 * Created by eason on 2018/11/30.
 */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import * as moment from 'moment';

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {GlobalSearch,globalSearchApi} from "./global-search";

@Injectable()
export class GlobalSearchService {
    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService
    ){}

    getObjModules(comp) {
        this.http
            .post(globalSearchApi.getObjModules,$.param({keyword:comp.searchData.keyword}),{ headers: API.form})
            .subscribe((data:any)=>{
                comp.moduleList = data.moduleList;

                if(comp.dtElement){
                    comp.onSearch();
                }else{
                    comp.setGrid();
                }

            });
    }

    /**获取关联模块文本**/
    getRelationalLabel(moduleName,comp){
        this.http
            .post(API.api + "/label/getLabel", $.param({module:moduleName}), {headers: API.form})
            .subscribe((data: any) => {
                comp.relationalLabel = data.label;
            });
    }
}
