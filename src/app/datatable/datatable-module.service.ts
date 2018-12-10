/**
 * Created by Leo on 2017/11/29.
 */
import { Injectable, ViewChild } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UtilService} from "../util/util.service";
import {DtOption} from "./datatable";
import {LabelService} from "../util/label.service";
import {CookieService} from "../util/cookie.service";
import * as moment from 'moment';
import {API} from "../config";

@Injectable()
export class ModuleDatatableService{
    moduleLabel:any
    hasDtInstance = false;
    options:any ;

    constructor(
        private util : UtilService,
        private label : LabelService,
        private cookie : CookieService,
        private http: HttpClient
    ){
        //this.getModuleText();
    }

    //设置语言
    getModuleText(){
        let flag = true;
        this.http
            .post(API.api + "/label/getLabel", $.param({module: 'datatable'}), {headers: API.form})
            .subscribe((data: any) => {
                this.moduleLabel = data.label;
                if(flag){
                    flag = false;
                    this.options.language = {
                        loadingRecords: this.moduleLabel.text.loading,
                        processing: this.moduleLabel.text.process,
                        infoEmpty: this.moduleLabel.text.infoEmpty,
                        info: this.moduleLabel.text.info,
                        emptyTable: this.moduleLabel.text.emptyTable,
                        paginate: {
                            previous: this.moduleLabel.text.previous,
                            next: this.moduleLabel.text.next,
                            first: this.moduleLabel.text.first,
                            last: this.moduleLabel.text.last,
                        },
                        select: {
                            rows: {
                                _: this.moduleLabel.text.selectRow,
                                0: "",
                            }
                        }
                    };
                }
            });
    }

    initOpt(opt){
        this.options = {};
        this.hasDtInstance = false;
        this.options = {
            dom: 't<"row" <"col-sm-12 col-md-5"i>r<"col-sm-12 col-md-7"p>>',
            //order:[['1','asc']],
            order:[],
            iDisplayLength: opt.iDisplayLength?opt.iDisplayLength:10,
            processing: true,
            serverSide: true
        };
        this.getModuleText();
    }

    //search
    onSearch(comp){
        comp.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    //选择 checkbox
    onSelect(comp){
        //监听checkbox select
        this.hasDtInstance = true;
        comp.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.on( 'select',  ( e, dt, type  )=> {
                if ( type === 'row' ) {
                    comp.isBtnDelete = false;
                }
            } )
            dtInstance.on( 'deselect', ( e, dt, type  ) => {
                if ( type === 'row' ) {
                    if(dtInstance.rows('.selected').data()[0] == undefined){
                        comp.isBtnDelete = true;
                    }
                }
            } );
        });
    }

    onRender(col,data,full,comp){
        let d:string|number = "";
        if(col.fieldType == "select" || col.fieldType == "autocomplete"){
            for(let f of comp.optionList[col.name]){
                if(f.optionId == full[col.name]){
                    d = f.optionName?f.optionName:"";
                }
            }
        }else if(col.fieldType == "multiselect"){
            d = full[col.name+'Value']?full[col.name+'Value']:"";
        }else if(col.fieldType == "date"){
			let format = col.format?col.format:"YYYY-MM-DD";
			if(typeof data == "number"){
                d = moment(data).format(format);
            }else if(typeof data == "string"){
                d = data;
            }

        }else{
            d = data?data:"";
        }
        return d;
    }

    setGrid(opt:DtOption,comp){
        this.initOpt(opt);

        if(opt.hasSelect){
            this.options.select = {style:'multi',selector:'td:first-child'};
            this.options.drawCallback = ((settings:any)=>{
                if(!this.hasDtInstance){
                    this.onSelect(comp);
                }
            })
        }

        if(opt.order){
            this.options.order = opt.order;
        }

        let uid = this.cookie.getCookie("uid");
        let token = this.cookie.getCookie("x-auth-token");
        let lang = this.cookie.getCookie("x-lang")?this.cookie.getCookie("x-lang"):"en";
        const head = new Object();
        if(uid){
            head["uid"] = uid;
        }
        if(token){
            head["x-auth-token"] = token;
        }
        if(lang){
            head["x-lang"] = lang;
        }
        this.options.ajax = {
            url: opt.ajax.url,// + ";jsessionid="+window.localStorage.getItem('sessionId')
            type:'POST',
            headers:head,
            data:((d:any) =>{
                for(let search of comp.searchFieldList){
                    if(search.fieldType == "autocomplete"){
                        if(typeof comp.searchForm.value[search.fieldLabel] == "string"){
                            comp.searchForm.value[search.fieldLabel] = null;
                            comp.searchForm.controls[search.fieldLabel].setValue(null);
                        }
                    }else if(search.fieldType == "multiselect" && comp.searchForm.value[search.fieldLabel]){
                        comp.searchForm.value[search.fieldLabel] = comp.searchForm.value[search.fieldLabel].toString();
                    }
                }
                d.searchForm = JSON.stringify(comp.searchForm.value);
            })
        }

        let col = [];
        for(let o of opt.columns){
            let orderable = o.orderable?true:false;
            let visible = true;
            if(o.visible == false){
                visible = false;
            }
            if(o.isSelect){
                col.push({data:null, defaultContent: "", className:"select-checkbox", orderable: orderable, visible:visible})
            }else if(o.isLink){
                col.push(
                    {data:o.data, name:o.name, orderable: orderable, visible:visible, render:(data,type,full,meta) => {
                        const d = this.onRender(o,data,full,comp);
                        return `<a class='link-detail c-p' data-keyid="${full[o.keyField]}">
                            <u class='text-primary'>${d?d:""}</u>
                        </a>`
                    }}
                )
            }else{
                col.push({data:o.data, name:o.name, orderable: orderable, visible:visible,render:(data,type,full,meta) => {
                    const d = this.onRender(o,data,full,comp);
                    return `${d}`
                }})
            }
        }

        this.options.columns = col;

        if(opt.hasLink){
            this.options.rowCallback = (row: Node, data: any[] | Object, index: number) => {
                $('td',row).each((index,node)=>{
                    const el = $(node).find(".link-detail");
                    if( el.length > 0){
                        let keyId = el.data('keyid');
                        el.unbind('click');
                        el.bind('click', () => {
                            comp.onDetail(keyId);
                        });
                    }
                })
                return row;
            }
        }
        return this.options;
    }



}
