/**
 * Created by Leo on 2017/11/23.
 */
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {QuotationApi} from "../quotation";
import {API} from "../../../config";
import {LayerService} from "../../../layer/layer.service";


@Component({
    selector: 'quotation-linkage',
    templateUrl: './quotation-linkage.component.html'
})
export class QuotationLinkageComponent implements OnInit {
    globalLabel: any;
    moduleLabel: any;
    linkageModuleList: any;
    linkageFieldList:any;
    linkageData: Array<any>;
    linkageTextList: Array<any> = new Array();
    linkageModuleLength:number = 0;
    selectedIndex:number = 0;

    constructor(
        public dialogRef: MatDialogRef<QuotationLinkageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private http: HttpClient,
        private layer:LayerService
    ) {}

    addList(e,item, index) {
        if(e.checked){
            for(let l = 0; l < this.linkageModuleList.length; l++){
                if(index == l){
                    for(let l2 of this.linkageModuleList[l]){
                        if(l2.checked){
                            l2.checked = false;
                            const end = this.linkageModuleList.length - index;
                            if(index < end){
                                this.linkageModuleList.splice(index + 1, end);
                                this.linkageData.splice(index,end);
                            }
                        }
                    }
                }
            }
            item.checked = true;

            let moduleArr = this.linkageFieldList.linkageModule.split(",");
            let moduleViewArr = this.linkageFieldList.linkageViews.split(",");
            let moduleKeyArr = this.linkageFieldList.linkageKey.split(",");
            this.linkageModuleLength = moduleArr.length;

            let obj = {
                "moduleName": item.moduleName,
                "linkageName": item.linkageName,
                "linkageId": item.linkageId,
                "linkageKey": item.linkageKey,
                "linkageViews": item.linkageViews
            };
            if( this.linkageData[index]){
                this.linkageData[index] = obj
            }else{
                this.linkageData.push(obj)
            }

            if(item.nextLinkageViews){
                /**获取父级Id获取下级联动配置**/
                const loading = this.layer.loading();
                let data = {"viewsName":item.nextLinkageViews,"keyName":item.linkageKey,"keyId":item.linkageId};
                this.http
                    .post(QuotationApi.getLinkageModuleListById,$.param(data), {headers: API.form})
                    .subscribe((data: any) => {
                        this.linkageModuleList.push([]);
                        let leng = this.linkageModuleList.length - 1;
                        for(let i = 0; i < data.data.length; i++ ){
                            data.data[i].moduleName =  moduleArr[leng];
                            data.data[i].linkageViews =  moduleViewArr[leng];
                            data.data[i].linkageKey =  moduleKeyArr[leng];
                            data.data[i].nextLinkageModule =  moduleArr[leng+1];
                            data.data[i].nextLinkageViews =  moduleViewArr[leng+1];

                        }
                        this.linkageTextList.push(this.globalLabel["text"][moduleArr[leng]]);
                        this.linkageModuleList[leng] = data.data;
                        this.selectedIndex = index + 1;
                        loading.close();
                    },err => {
                        loading.close();
                        this.layer.msg({type:"msg_danger",text:this.globalLabel['tips']['systemErr']});
                    });
            }
        }else{
            item.checked = false;
            const end = this.linkageModuleList.length - index;
            this.linkageData.splice(index,end);
            if(index < end){
                this.linkageModuleList.splice(index + 1, end);
                for(let l = 0; l < this.linkageModuleList.length; l++){
                    if(index == l || l > index){
                        for(let l2 of this.linkageModuleList[l]){
                            l2.checked = false;
                        }
                    }
                }
            }
        }
    }

    onTabsChange(e: any) {
        this.selectedIndex = e.index;
    }

    onIndexChange(index: number) {
        this.selectedIndex = index;
    }

    onInit(){
        this.linkageModuleList = Object.assign([],this.data.linkageModuleList);
        this.linkageFieldList = this.data.linkageFieldList;
        this.linkageData = new Array();

        for (let l of this.linkageModuleList) {
            this.linkageTextList.push(this.globalLabel["text"][l[0].moduleName])
            for(let l2 of l){
                l2.checked = false;
            }
        }
        this.linkageModuleLength = this.linkageFieldList.linkageModule.split(",").length;
    }

    onClose(){
        this.dialogRef.close();
        this.onInit();
    }

    onSave(){
        let obj ={"linkageData":this.linkageData,"linkageModuleList":this.linkageModuleList};
        this.dialogRef.close(obj);
    }


    ngOnInit() {
        this.globalLabel = this.data.globalLabel;
        this.moduleLabel = this.data.moduleLabel;
        this.onInit();
    }
}