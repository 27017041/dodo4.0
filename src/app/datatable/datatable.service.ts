/**
 * Created by Leo on 2017/11/29.
 */
import { Injectable, ViewChild } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {UtilService} from "../util/util.service";
import {DtOption} from "./datatable";
import {LabelService} from "../util/label.service";
import {CookieService} from "../util/cookie.service";
import * as moment from 'moment';
import {API} from "../config";

@Injectable()
export class DatatableService{
    moduleLabel:any
    hasDtInstance = false;
    options:any ;
    reloadRMGSubject:Subject<any> = new Subject<any>();
    reloadRMG$ = this.reloadRMGSubject.asObservable();
    getLabelFlag:boolean = true;

    constructor(
        private util : UtilService,
        private label : LabelService,
        private cookie : CookieService,
        private http: HttpClient
    ){ }

    //设置语言
    getModuleText(){
        this.http
            .post(API.api + "/label/getLabel", $.param({module: 'datatable'}), {headers: API.form})
            .subscribe((data: any) => {
                this.moduleLabel = data.label;
                if(this.getLabelFlag){
                    this.getLabelFlag = false;
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
            processing: true,
            serverSide: true,
            iDisplayLength: opt.iDisplayLength?opt.iDisplayLength:10
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
                    comp.isBtnSetClient != undefined? comp.isBtnSetClient = false:'';
                    comp.isBtnSetContact != undefined? comp.isBtnSetContact = false:'';
                }
            } )
            dtInstance.on( 'deselect', ( e, dt, type  ) => {
                if ( type === 'row' ) {
                    if(dtInstance.rows('.selected').data()[0] == undefined){
                        comp.isBtnDelete = true;
                        comp.isBtnSetClient != undefined? comp.isBtnSetClient = true:'';
                        comp.isBtnSetContact != undefined? comp.isBtnSetContact = true:'';
                    }
                }
            } );
        });
    }

    //设置表格
    setGrid(opt:DtOption,comp){
        this.initOpt(opt);//初始化

        //是否多选
        if(opt.hasSelect){
            this.options.select = {style:'multi',selector:'td:first-child'};
        }

        //排序
        if(opt.order){
            this.options.order = opt.order;
        }

        //ajax
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
                const data = this.util.isEmptyObj(opt.ajax.data)?{}:opt.ajax.data;
                d.searchForm = JSON.stringify(data);
            })
        }

        //columns
        let col = [];
        for(let o of opt.columns){

            let orderable = o.orderable?true:false;

            if(o.isSelect){
                col.push({data:null, defaultContent: "", className:"select-checkbox", orderable: orderable})
            }else if(o.isLink){
                col.push(
                    {data:o.data, name:o.name, orderable: orderable, render:(data,type,full,meta) => {
                        return `<a class='link-detail c-p' data-keyid="${full[o.keyField]}" 
                            data-keyname="${full[o.name]}" data-type="${full['moduleName']}">
                            <u class='text-primary'>${data?data:""}</u>
                         </a>`
                    }}
                )
            }else if(o.isAction){
                col.push(
                    {data:null, defaultContent: "", orderable: orderable, render:(data,type,full,meta) => {
                        let html = ``;
                        for(let b of o.actionOpt){
                            let arg = [];
                            for(let a of b.argName){
                                arg.push(full[a])
                            }
                            html += `<action data-fn="${b.fnName}" data-arg="${arg}" class="text-primary c-p m-r-05 ${b.className}"><u>${b.label}</u></action>`;
                        }
                        return html;
                    }}
                )
            }else{
                col.push({data:o.data, name:o.name, orderable: orderable,render:(data,type,full,meta) => {
                    return this.onRender(o,data,full,comp);
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
                        let keyName = el.data('keyname');
                        let type = el.data('type');

                        el.unbind('click');
                        el.bind('click', () => {
                            comp.onDetail(keyId,keyName,type);
                        });
                    }
                })
                return row;
            }
        }

        if(opt.hasAction){
            this.options.rowCallback = (row: Node, data: any[] | Object, index: number) => {
                $('td',row).each((index,node)=>{
                    const el = $(node).find("action");
                    el.each(function(){
                        let fn = $(this).data('fn');
                        let arg = $(this).data('arg').toString().split(",");
                        $(this).unbind('click');
                        $(this).bind('click', () => {
                            function doCallback(fn,args){
                                fn.apply(comp, args);//转换为多参数
                            }
                            doCallback(comp[fn],arg);
                        });
                    })
                })
                return row;
            }
        }

        this.options.drawCallback = ((settings: any) => {
            if(this.options.select){
                if(!this.hasDtInstance){
                    this.onSelect(comp);
                }
            }

            //等待接收刷新表格的数据流
            let moduleName = opt.ajax.moduleName;
            if(moduleName){
                let sub = this.reloadRMG$.subscribe((data: any) => {
                    if (moduleName == data.ajax.moduleName) {
                        opt = data;
                        this.onSearch(comp);
                    }
                    sub.unsubscribe();
                })
            }

        })

        return this.options;
    }

    //渲染 colums
    onRender(col,data,full,comp){
        if(data){
            if(col.textOverflow){
                if(data.length > 20){
                    let str = "";
                    str = str + data.substring(0,19) + "...";
                    return str;
                }else{
                    return data;
                }
            }else if(col.fieldType == "date"){
                let format = col.format?col.format:"YYYY-MM-DD";
                return moment(parseInt(data)).format(format);
            }else if(col.fieldType == "currency"){
                let curSymbol = full.currencyName?full.currencyName:'USD';
                return curSymbol+' '+this.toThousands(parseInt(data));
            }else{
                return data;
            }
        }else{
            return "";
        }
    }

    //金额转换
    toThousands(num){
        if(num!=undefined){
            let result = '';
            let str = num.toString();
            let strNum = 0;
            let strF = '';
            let strB = '';
            if(str.indexOf('.') > 0){
                strNum = str.indexOf('.');
                strF = str.substring(0,strNum);
                strB = str.substring(strNum,str.length)
                while (strF.length > 3) {
                    result = ',' + strF.slice(-3) + result;
                    strF = strF.slice(0, strF.length - 3);
                }
                if (strF) { result = strF + result; }
                return result+strB;
            }else{
                while (str.length > 3) {
                    result = ',' + str.slice(-3) + result;
                    str = str.slice(0, str.length - 3);
                }
                if (str) { result = str + result; }
                return result;
            }
        }else{
            return '0';
        }
    }


}
