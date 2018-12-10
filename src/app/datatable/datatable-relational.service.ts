/**
 * Created by Leo on 2017/11/29.
 */
import {Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UtilService} from "../util/util.service";
import {DtOption} from "./datatable";
import {LabelService} from "../util/label.service";
import {CookieService} from "../util/cookie.service";
import * as moment from 'moment';
import {FormField} from "../main/module/module";
import {ModuleService} from "../main/module/module.service";
import {API} from "../config";

@Injectable()
export class ModuleRelationalService {
    moduleLabel: any
    hasDtInstance = false;
    options: any;

    constructor(private util: UtilService,
                private label: LabelService,
                private cookie: CookieService,
                private ms: ModuleService,
                private http: HttpClient) {
        //this.getModuleText();
    }

    //设置语言
    getModuleText() {
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

    initOpt(opt) {
        this.options = {};
        this.hasDtInstance = false;
        this.options = {
            dom: 't<"row" <"col-sm-12 col-md-5"i>r<"col-sm-12 col-md-7"p>>',
            //order: [['1', 'asc']],
            order:[],
            iDisplayLength: opt.iDisplayLength ? opt.iDisplayLength : 10,
            processing: true,
            serverSide: true
        };
        this.getModuleText();
    }

    //search
    onSearch(comp) {
        comp.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    onRender(col, data, full, comp) {
        let d: string|number = "";
        if (col.fieldType == "date") {
            let format = col.format ? col.format : "YYYY-MM-DD";
            if (typeof data == "number") {
                d = moment(data).format(format);
            } else if (typeof data == "string") {
                d = data;
            }

        } else {
            d = data ? data : "";
        }
        return d;
    }

    setGrid(opt: DtOption, comp) {
        this.initOpt(opt);

        if (opt.order) {
            this.options.order = opt.order;
        }

        let uid = this.cookie.getCookie("uid");
        let token = this.cookie.getCookie("x-auth-token");
        let lang = this.cookie.getCookie("x-lang") ? this.cookie.getCookie("x-lang") : "en";
        const head = new Object();
        if (uid) {
            head["uid"] = uid;
        }
        if (token) {
            head["x-auth-token"] = token;
        }
        if (lang) {
            head["x-lang"] = lang;
        }

        let formFielList: Array<FormField>;
        this.options.ajax = {
            url: opt.ajax.url,// + ";jsessionid="+window.localStorage.getItem('sessionId')
            type: 'POST',
            headers: head,
            data: ((d: any) => {
                d.keyId = comp.keyId;
                d.moduleName = opt.ajax.data.moduleName;
                d.relationalName = opt.ajax.data.relationalName;
            }),
            complete: ((d: any) => {
                comp.relationalFormList[opt.ajax.data.relationalName] = d.responseJSON.formFieldList;
            })
        }

        let col = [];
        opt.relationalFields.forEach((o, index) => {
            let orderable = o.orderable?true:false;
            let visible = true;
            if (o.isDisplay == 0) {
                visible = false;
            }
            if (o.isLink) {
                col.push(
                    {
                        data: o.fieldName, name: o.fieldName, orderable: orderable, visible: visible, render: (data, type, full, meta) => {
                        const d = this.onRender(o, data, full, comp);
                        return `<a class='link-detail c-p' data-keyid="${full[o.tableKey]}" data-relational="${o.relationalName}"
                                    data-name="${d ? d : "Tab"}" data-url="${o.linkUrl}" data-form="${formFielList}">
                                    <u class='text-primary'>${d ? d : ""}</u>
                                </a>`
                    }
                    }
                )
            } else {
                col.push({
                    data: o.fieldName, name: o.fieldName, orderable: orderable, visible: visible, render: (data, type, full, meta) => {
                        const d = this.onRender(o, data, full, comp);
                        return `${d}`
                    }
                })
            }
            if (index == opt.relationalFields.length - 1) {
                if (o.isDelete || o.isHistory) {
                    col.push(
                        {
                            data: null,
                            defaultContent: "",
                            visible: true,
                            orderable: false,
                            render: (data, type, full, meta) => {
                                let html = "";
                                if (o.isDelete) {
                                    html += `<i class="fa fa-close text-danger c-p link-delete" data-relational="${o.relationalName}"
                                data-keyid="${full[o.tableKey]}" data-url="${o.deleteUrl}"></i>`;
                                }
                                if (o.isHistory) {
                                    html += `<i class="fa fa-history text-info c-p  link-history" data-relational="${o.relationalName}"
                                data-keyid="${full[o.tableKey]}" data-url="${o.historyUrl}"></i>`;
                                }
                                return html;
                            }
                        }
                    )
                }
            }
        });

        this.options.columns = col;

        this.options.rowCallback = (row: Node, data: any[] | Object, index: number) => {
            $('td', row).each((index, node) => {
                const elDetail = $(node).find(".link-detail");
                const elDelete = $(node).find(".link-delete");
                const elHistory = $(node).find(".link-history");

                if (opt.hasLink) {
                    if (elDetail.length > 0) {
                        let keyId = elDetail.data('keyid');
                        let name = elDetail.data('name');
                        let url = elDetail.data('url');
                        let relational = elDetail.data('relational');
                        elDetail.unbind('click');
                        elDetail.bind('click', () => {
                            let obj = {"tableKey": keyId, "name": name, "url": url, "relationalName": relational};
                            comp.onLick(obj);
                        });
                    }
                }

                if (opt.hasDelete) {
                    if (elDelete.length > 0) {
                        let keyId = elDelete.data('keyid');
                        let url = elDelete.data('url');
                        let relational = elDelete.data('relational');
                        elDelete.unbind('click');
                        elDelete.bind('click', () => {
                            let obj = {"tableKey": keyId, "url": url, "relationalName": relational};
                            comp.onLinkDelete(obj);
                        });
                    }
                }

                if (opt.hasHistory) {
                    if (elHistory.length > 0) {
                        let keyId = elHistory.data('keyid');
                        let url = elHistory.data('url');
                        let relational = elHistory.data('relational');
                        elHistory.unbind('click');
                        elHistory.unbind('click', () => {
                            let obj = {"tableKey": keyId, "url": url, "relationalName": relational};
                            comp.onLinkHistory(obj);
                        });
                    }
                }
            })
            return row;
        }


        this.options.drawCallback = ((settings: any) => {
            //等待接收刷新表格的数据流
            let relationalName = opt.ajax.data.relationalName;
            let sub = this.ms.reloadRMG$.subscribe((data: any) => {
                if (relationalName == data) {
                    this.onSearch(comp);
                }
                sub.unsubscribe();
            })
        })

        return this.options;
    }


}
