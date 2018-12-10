/**
 * Created by Leo on 2017/11/28.
 */
import { Injectable,ComponentFactory } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators  } from '@angular/forms';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {ModuleApi} from "./module";
import {UtilService} from "../../util/util.service";
import {LabelService} from "../../util/label.service";
import {QuotationFormComponent} from "../quotation/quotation-form.component";
import {DialogTreeComponent} from "../dialog/dialog-tree.component";

@Injectable()
export class ModuleService {

    private reloadRMGSubject:Subject<any> = new Subject<any>();
    reloadRMG$ = this.reloadRMGSubject.asObservable();

    constructor(
        private fb:FormBuilder,
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService,
        private util:UtilService,
        private label:LabelService
    ){}

    getModuleConf(comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleApi.getModule,$.param({moduleName:comp.moduleName}),{ headers: API.form})
            .subscribe((data:any)=>{
                comp.searchFieldList = data.searchFieldList;
                comp.gridFieldList = data.gridFieldList;
                comp.formFieldList = data.formFieldList;

                comp.searchForm = this.createForm(data.searchFieldList,comp);
                comp.gridForm = this.createForm(data.gridFieldList,comp);
                comp.moduleForm = this.createForm(data.formFieldList,comp);
                comp.setGrid();
                this.getSelectList(comp);
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    getSelectList(comp){
        for(let form of comp.formFieldList){
            if(form.fieldType == "select" || form.fieldType == "autocomplete" || form.fieldType == "multiselect"){
                let key = form['fieldLabel'];
                this.http
                    .post(API.getSelectList,$.param({typeId:form.selectTypeId}),{headers: API.form })
                    .subscribe((data:any)=>{
                        comp.optionList[key]  = data.result;
                    });
            }
        }
    }

    createForm(fieldList,comp){
        let obj = {};
        for(let field of fieldList){
            let disabled = false;
            if(field.isDisabled == 85){
                disabled = true;
            }
            if(field.validation || field.pattern){
                let validation = this.setValidation(field);
                obj[field.fieldLabel] = [{value:"",disabled:disabled},validation];
            }else{
                obj[field.fieldLabel] = [{value:"",disabled:disabled}];
            }
        }
        return this.fb.group(obj);
    }

    setValidation(field){
        let valiArr = [];
        if(field.validation){
            valiArr = field.validation.split(",");
        }
        if(field.pattern){
            valiArr.push("pattern");
        }
        let validation = [];
        for(let v of valiArr){
            if(v == "required"){
                validation.push(Validators.required);
            }else if(v == "email"){
                validation.push(Validators.email);
            }else if(v == "min"){
                validation.push(Validators.min(field.minValue));
            }else if(v == "max"){
                validation.push(Validators.max(field.maxValue));
            }else if(v == "min_length"){
                validation.push(Validators.minLength(field.minLengthValue));
            }else if(v == "max_length"){
                validation.push(Validators.maxLength(field.maxLengthValue));
            }else if(v == "pattern"){
                validation.push(Validators.pattern(field.pattern));
            }
        }
        return validation;
    }

    onSave(formData,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleApi.saveData,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                        comp.moduleForm.reset();
                        comp.onReload.emit(true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failAdd']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onDetail(keyId,comp,isRefresh?){
        const loading = this.layer.loading();
        this.http
            .post(ModuleApi.getDetail,$.param({keyId:keyId}),{ headers: API.form})
            .subscribe((data:any)=>{
                const dd = Object.assign({}, data.data);
                for(let ff of comp.formFieldList){
                    if(ff.isDisplay == 29 && ff.fieldType == "multiselect"){
                        dd[ff.fieldLabel] = dd[ff.fieldLabel].split(",");
                        for(let df in dd[ff.fieldLabel]){
                            dd[ff.fieldLabel][df] = parseInt(dd[ff.fieldLabel][df]);
                        }
                    }
                }
                if(isRefresh){
                    comp.moduleData = dd;
                    comp.oldModuleData = dd;
                }else{
                    comp.moduleData = dd;
                    if(!comp.isDisplay){comp.isDisplay = true;}
                    comp.selectedIndex = 1;
                    comp.pageType = "detail";
                }
                loading.close();
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    onUpdate(formData,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleApi.updateData,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                        this.onDetail(data.keyId,comp,true);
                        comp.moduleForm.markAsPristine();
                        comp.onReload.emit(true);
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    prepareDelete(selectData,comp){
        let checkIds = "";
        for(let i=0;i<selectData.length;i++){
            checkIds = checkIds+selectData[i][comp.moduleName+'Id']+',';
        }
        checkIds = checkIds.substring(0,checkIds.length-1);
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.onDelete(checkIds,comp);
            }
        });
    }

    onDelete(ids,comp){
        const loading = this.layer.loading();
        this.http
            .post(ModuleApi.deleteData,$.param({keyIds:ids}),{ headers:API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result) {
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']},()=>{
                        const idsArr = ids.split(",");
                        for(let i of idsArr){
                            if(i == comp.openId){
                                if(comp.isDisplay){comp.isDisplay = false;}
                            }
                        }
                        comp.searchForm.reset();
                        comp.onSearch();
                        comp.isBtnDelete = true;
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    setLogData(comp){
        const log = [];
        for(let field of comp.formFieldList){
            if(field.isDisplay == 29){
                let newValue = comp.moduleForm.value[field.fieldLabel]?comp.moduleForm.value[field.fieldLabel]:null;
                let oldValue = comp.oldModuleData[field.fieldLabel]?comp.oldModuleData[field.fieldLabel]:null;
                if(newValue != oldValue){
                    let obj = {
                        description:field.fieldLabel + ' changed from ' + oldValue + ' to ' + newValue,
                        fieldName:field.fieldLabel
                    };

                    log.push(JSON.stringify(obj))
                }
            }
        }
        return log.toString();
    }

    /**获取联动配置，第一个关联模块List**/
    getLinkageModuleList(field,comp){
        let moduleArr = field.linkageModule.split(",");
        let moduleViewArr = field.linkageViews.split(",");
        let moduleKeyArr = field.linkageKey.split(",");
        this.http
            .post(ModuleApi.getLinkageModuleList,"viewsName="+moduleViewArr[0],{ headers:API.form })
            .subscribe((data:any)=>{
                for(let i = 0; i < data.data.length; i++ ){
                    data.data[i].moduleName =  moduleArr[0];
                    data.data[i].linkageViews =  moduleViewArr[0];
                    data.data[i].linkageKey =  moduleKeyArr[0];
                    data.data[i].nextLinkageModule =  moduleArr[1];
                    data.data[i].nextLinkageViews =  moduleViewArr[1];
                }
                comp.linkageModuleList[0] = data.data;
            })
    }

    /**打开联动设置框**/
    openLinkageDialog(comp){
        const dialogRef = this.dialog.open( DialogTreeComponent,{
            width:"50%",
            disableClose:true,
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                linkageModuleList:comp.linkageModuleList,
                formFieldList:comp.formFieldList/*,
                linkageData:comp.moduleData.linkageModule*/
            },
        });
        dialogRef.afterClosed().subscribe((result:any) => {
            if(result){
                if(comp.pageType == "add"){
                    comp.moduleForm.controls.linkageModule.setValue(JSON.stringify(result.linkageData));
                    for(let l of result.linkageData){
                        comp.moduleForm.controls[l.linkageKey].setValue(l.linkageId);
                        comp.moduleForm.controls[l.moduleName+"Name"].setValue(l.linkageName);
                    }
                }else{
                    //comp.linkageModuleList = result.linkageModuleList;
                    comp.moduleData.linkageModule = JSON.stringify(result.linkageData);
                    for(let l of result.linkageData){
                        comp.moduleData[l.linkageKey] = l.linkageId;
                        comp.moduleData[l.moduleName+"Name"] = l.linkageName;
                    }
                    comp.moduleForm.setValue( comp.moduleData);
                }

            }
        });
    }

    /**获取关联模块的配置**/
    getRelational(comp,moduleName){
        this.http
            .post(ModuleApi.getRelational,"moduleName="+moduleName,{ headers:API.form })
            .subscribe((data:any)=>{
                comp.relationalList = data.relational;
                comp.relationalItemList = data.relationalItem;
                comp.dtOptionsList = new Array(data.relational.length);

                let arr = new Array(data.relational.length);
                for(let r=0; r<comp.relationalList.length; r++){
                    let arr2 = [];
                    for(let i=0; i<comp.relationalItemList.length; i++){
                        if(comp.relationalList[r].id == comp.relationalItemList[i].relationalId){
                            let obj = Object.assign({},comp.relationalItemList[i]);
                            obj.relationalName = comp.relationalList[r].relationalName;
                            obj.tableField = comp.relationalList[r].tableField;
                            obj.tableName = comp.relationalList[r].tableName;
                            obj.tableKey = comp.relationalList[r].tableKey;
                            obj.fieldName = this.util.convertFiledName(obj.fieldName);
                            obj.moduleName = comp.relationalList[r].moduleName;
                            obj.isDelete = comp.relationalList[r].isDelete;
                            obj.deleteUrl = comp.relationalList[r].deleteUrl;
                            obj.isHistory = comp.relationalList[r].isHistory;
                            obj.historyUrl = comp.relationalList[r].historyUrl;
                            arr2.push(obj);
                        }
                    }
                    arr[r] =arr2;
                }
                comp.relationalFieldList = arr;

                for(let r of comp.relationalFieldList){
                    this.http
                        .post(API.api + "/label/getLabel", $.param({module: r[0].relationalName}), {headers: API.form})
                        .subscribe((data: any) => {
                            comp.relationalLabelList[r[0].relationalName] = data.label;
                        });
                }
                comp.setGrid(comp.relationalFieldList);

            });
    }

    /**获取关联模块的详情和详情的关联表**/
    getRelationalModuleDetail(comp,isRefresh?){
        this.http
            .post(API.api+ "/" +comp.relationalData.url,$.param({keyId:comp.relationalData.tableKey}),{ headers: API.form})
            .subscribe((data:any)=>{
                const dd = Object.assign({}, data.data);
                for(let ff of comp.formFieldList){
                    if(ff.isDisplay == 29 && ff.fieldType == "multiselect"){
                        dd[ff.fieldLabel] = dd[ff.fieldLabel].split(",");
                        for(let df in dd[ff.fieldLabel]){
                            dd[ff.fieldLabel][df] = parseInt(dd[ff.fieldLabel][df]);
                        }
                    }
                }

                if(isRefresh){
                    comp.moduleData = dd;
                    comp.oldModuleData = dd;
                }else{
                    comp.moduleData = dd;
                    comp.oldModuleData = Object.assign({}, dd);
                    comp.moduleForm.setValue(dd);
                }
            });
    }

    /**在新打开的关联tabs 里面保存form 数据**/
    onUpdateRMD(formData,comp){
        const loading = this.layer.loading();
        let url =  API.api +"/"+ comp.relationalData.relationalName + "/updateData";
        this.http
            .post(url,$.param(formData),{ headers: API.form })
            .subscribe((data:any)=>{
                loading.close();
                if(data.result){
                    this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                        this.getRelationalModuleDetail(comp,true);
                        comp.moduleForm.markAsPristine();
                        this.reloadRMGSubject.next(comp.relationalData.relationalName);//通知页面grid 刷新
                    });
                }else{
                    this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failUpdate']});
                }
            },err => {
                loading.close();
                this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
            });
    }

    /**获取自定义模块的详情**/
    getCustomDetail(obj,index,comp){
        this.http
            .post(API.api + "/label/getLabel", $.param({module: obj.relationalName}), {headers: API.form})
            .subscribe((data: any) => {
                comp.relationalLabel = data.label;
            });
    }

    /**关联表格，删除数据**/
    onLinkDelete(obj,comp){
        const dialogRef = this.layer.alert(comp.globalLabel.tips.delSeleItem)
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                const loading = this.layer.loading();
                let url =  API.api +"/"+ obj.url;
                this.http
                    .post(url,"keyIds="+obj.tableKey,{ headers: API.form })
                    .subscribe((data:any)=>{
                        loading.close();
                        if(data.result) {
                            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succDel']});
                            this.reloadRMGSubject.next(obj.relationalName);//通知页面grid 刷新
                        }else{
                            this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['failDel']});
                        }
                    },err => {
                        loading.close();
                        this.layer.msg({type:"msg_danger",text:comp.globalLabel['tips']['systemErr']});
                    });
            }
        });

    }

}