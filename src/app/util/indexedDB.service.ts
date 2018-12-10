/**
 * Created by Leo on 2018/11/11.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDBService{
    private databaseName: string = 'Test';
    private version: number = 4;
    private db: any = null;

    constructor(){

    }

    // 打开并创建数据库
    open(databaseName?:string):Promise<any>{
        databaseName!==undefined&&databaseName!==""?this.databaseName=databaseName:this.databaseName;
        return new Promise<any>((resolve,reject)=>{
            //打开数据库
            let request = indexedDB.open(this.databaseName,this.version);
            request.onsuccess = function(event){
                this.db = event.target.result;
                resolve();
            }.bind(this);
            // 此处说明.bind(this)，是为了把当前类的属性和方法传入req.onsuccess的这个function里。
            // 即：.bind(this)的this是指本类IndexedDBService

            // 打开DB失败后的回调
            request.onerror = reject;


            // 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded。
            // 新建数据库与打开数据库是同一个操作。如果指定的数据库不存在，就会新建。
            // 不同之处在于，后续的操作主要在upgradeneeded事件的监听函数里面完成，因为这时版本从无到有，所以会触发这个事件。
            request.onupgradeneeded = function(event){
                // 如果版本升级要记得删除旧的数据库表再建立新的。
                this.db = event.target.result;
                let storeNames = this.db.objectStoreNames;
                if (storeNames && storeNames.length > 0) {
                    for (let i = 0 ; i < storeNames.length ; i++) {
                        this.db.deleteObjectStore(storeNames[i]);
                    }
                }
                this.createTable();// 创建数据库表
            }.bind(this);
        });
    }

    // 关闭数据库
    close(){
        this.db.close();
    }

    // 删除数据库
    deleteDB(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.close();   // 先关闭连接再删
            let req = indexedDB.deleteDatabase(this.databaseName);
            req.onsuccess = function(event) {
                this.db = null;
                resolve();
            }.bind(this);
            req.onerror = reject;
        });
    }

    // 添加数据
    add(tableName:string, value:any|Array<any>):Promise<any>{
        if(!value || value.length === 0){
            return Promise.resolve();
        }
        let transaction = this.db.transaction([tableName],"readwrite");
        let stroe = transaction.objectStore(tableName);
        return new Promise<any>((resolve,reject)=>{
            if(value instanceof Array){
                value.forEach(row => {
                    stroe.add(row);
                })
                transaction.oncomplete = resolve;
                transaction.onerror = reject;
            }else{
                let request = stroe.add(value);
                request.onsuccess = resolve;
                request.onerror = reject;
            }
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    // 删除数据
    remove(tableName:string,keyValue:any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let transaction = this.db.transaction(tableName, 'readwrite');
            let store = transaction.objectStore(tableName);
            let request = store.delete(keyValue);
            request.onsuccess = resolve;
            request.onerror = reject;
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    // 清空表数据
    clear(tableName:string): Promise<any>{
        return new Promise<any>((resolve, reject)=>{
            let transaction = this.db.transaction(tableName, 'readwrite');
            let store = transaction.objectStore(tableName);
            let request = store.clear();
            request.onsuccess = resolve;
            request.onerror = reject;
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    // 清空全部表数据
    clearAll(): Promise<any>{
        let tableNames = this.db.objectStoreNames;
        let tableNamesList:Array<string> = new Array<string>();
        if(!tableNames || tableNames.length === 0){
            return Promise.resolve();
        }

        for(let name of tableNames){
            tableNamesList.push(name);
        }

        return Promise.all(tableNamesList.map((tableName)=>{
            return this.clear(tableName);
        })).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    // 更新数据
    update(tableName:string,key:any,value:any): Promise<any> {
        return new Promise<any>((resolve,reject)=>{
            let transaction = this.db.transaction(tableName, 'readwrite');
            let store = transaction.objectStore(tableName);
            let request = store.put(value,key);
            request.onsuccess = resolve;
            request.onerror = reject;
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    //根据Key值获取数据，注意是表格的key值。
    getByKey(tableName:string,keyValue:any): Promise<any> {
        return new Promise<any>((resolve,reject)=>{
            let transaction = this.db.transaction(tableName, 'readwrite');
            let store = transaction.objectStore(tableName);
            let request = store.get(keyValue);
            request.onsuccess = function () {
                resolve(request.result);
            };
            request.onerror = reject;
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    //根据索引获取数据,eg:getByIndex("categoryLv1","value","Catgory1-1")
    getByIndex(tableName:string,indexName:string,indexValue:any): Promise<any> {
        return new Promise<any>((resolve,reject)=>{
            let transaction = this.db.transaction(tableName, 'readwrite');
            let store = transaction.objectStore(tableName);
            let index = store.index(indexName);
            let request = index.openCursor(indexValue);
            let result: Array<any> = new Array<any>();
            request.onsuccess = function(event) {
                let cursor = event.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(result);
                }
            }
            request.onerror = reject;
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    // 读取表格全部数据
    getAll(tableName:string): Promise<any> {
        return new Promise<any>((resolve,reject)=>{
            let transaction = this.db.transaction(tableName, 'readwrite');
            let store = transaction.objectStore(tableName);
            let request = store.openCursor();
            let result: Array<any> = new Array<any>();
            request.onsuccess = function(event) {
                let cursor = event.target.result;
                if (cursor) {
                    let obj = Object.assign({},cursor.value);
                    obj.key = cursor.key;
                    result.push(obj);
                    cursor.continue();
                } else {
                    resolve(result);
                }
            }
            request.onerror = reject;
        }).catch(function(error){
            console.error(error);
            return Promise.reject(error);
        });
    }

    // 创建表格
    private createTable(){
        this.createCategory();
        this.createProductManagement();
        this.createPuppplierManagement();
        this.createCustomerManagement();
    }

    private createCategory(){
        let objectStore:any;
        if(!this.db.objectStoreNames.contains('categoryLv1')){
            objectStore = this.db.createObjectStore('categoryLv1', { autoIncrement: true });//{ keyPath: "id" }
            //索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
            objectStore.createIndex('value', 'value', { unique: false });
        }
        if(!this.db.objectStoreNames.contains('categoryLv2')){
            objectStore = this.db.createObjectStore('categoryLv2', { autoIncrement: true });
            objectStore.createIndex('value', 'value', { unique: false });
        }
        if(!this.db.objectStoreNames.contains('categoryLv3')){
            objectStore = this.db.createObjectStore('categoryLv3',{ autoIncrement: true });
            objectStore.createIndex('value', 'value', { unique: false });
        }
        if(!this.db.objectStoreNames.contains('categoryLv4')){
            objectStore = this.db.createObjectStore('categoryLv4', { autoIncrement: true });
            objectStore.createIndex('value', 'value', { unique: false });
        }
    }

    private createProductManagement(){
        let objectStore:any;
        if(!this.db.objectStoreNames.contains('product-management')){
            objectStore = this.db.createObjectStore('product-management', { autoIncrement: true });//{ keyPath: "id" }
            objectStore.createIndex('value', 'value', { unique: false });
        }
    }

    private createPuppplierManagement(){
        let objectStore:any;
        if(!this.db.objectStoreNames.contains('supplier-management')){
            objectStore = this.db.createObjectStore('supplier-management', { autoIncrement: true });//{ keyPath: "id" }
            objectStore.createIndex('value', 'value', { unique: false });
        }
    }

    private createCustomerManagement(){
        let objectStore:any;
        if(!this.db.objectStoreNames.contains('customer-management')){
            objectStore = this.db.createObjectStore('customer-management', { autoIncrement: true });//{ keyPath: "id" }
            objectStore.createIndex('value', 'value', { unique: false });
        }
    }

}








/**
 * Created by Carson on 2018/5/23.
 */
/*
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import {LayerService} from "../../layer/layer.service";
import {API} from "../../config";
import {ProductManagementCategoryDialogComponent} from "./dialog/category-dialog.component";
import {IndexedDBService} from "../../util/indexedDB.service";


@Injectable()
export class ProductManagementService {

    constructor(
        private dialog: MatDialog,
        private http: HttpClient,
        private layer:LayerService,
        private indexDB: IndexedDBService
    ){}

    openIndexDB(comp){
        this.indexDB.open().then(()=>{
            this.getCategory(1,comp);
            this.getProductList(comp);
        })
    }

    /!**打开分类设置框**!/
    openCategoryDialog(level,comp){
        let  catgoryList:any[] = comp["categoryLv"+level+"List"],
            categoryData:any = null;

        if(comp.categoryOP == "add"){
            if(level != 1){
                categoryData = {parentId:comp.formData["categoryLv"+(level-1)],value:""};
            }else{
                categoryData = {value:""};
            }

        }else if(comp.categoryOP == "edit"){
            for(let c of catgoryList){
                if(c.key == comp.formData["categoryLv"+level]){
                    categoryData = c;
                }
            }
        }
        const dialogRef = this.dialog.open( ProductManagementCategoryDialogComponent,{
            width:"50%",
            disableClose:true,
            data: {
                globalLabel: comp.globalLabel,
                moduleLabel: comp.moduleLabel,
                level:level,
                categoryOP:comp.categoryOP,
                catgoryList:catgoryList,
                categoryData:categoryData
            },
        });
        dialogRef.afterClosed().subscribe((result:any) => {
            if(result){
                if(comp.categoryOP == "add"){
                    this.addCategory(level,result,comp);
                }else if(comp.categoryOP == "edit"){
                    this.editCategory(level,result,comp);
                }else if(comp.categoryOP == "remove"){
                    this.removeCategory(level,result,comp);
                }

            }
        });
    }

    addCategory(level:number,result,comp){
        const loading = this.layer.loading();
        let url:string = "categoryLv"+level;

        this.indexDB.add(url,result).then(()=>{
            loading.close();
            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{

                if(level == 1){
                    this.getCategory(level,comp);
                }else{
                    this.getCategoryById(level,result.parentId,comp);
                }
            });
        }).catch(function(error){
            loading.close();
        });
    }

    editCategory(level:number,result,comp){
        const loading = this.layer.loading();
        let url:string = "categoryLv"+level;

        this.indexDB.update(url,result.key,result).then(()=>{
            loading.close();
            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                this.getCategory(level,comp);
            });
        }).catch(function(error){
            loading.close();
        });
    }

    getCategory(level:number,comp){
        let url:string = "categoryLv"+level;
        this.indexDB.getAll(url).then((data)=>{
            comp["categoryLv"+level+"List"]= data;
            console.log(data)
        })
    }

    getCategoryById(level:number,parentId:number,comp){
        let url:string = "categoryLv"+level;
        this.indexDB.getAll(url).then((data)=>{
            let temp = [];
            for(let c of data){
                if(c.parentId == parentId){
                    temp.push(c);
                }
            }
            comp["categoryLv"+level+"List"]= temp;
            console.log(temp)
        })
    }

    removeCategory(level:number,keyValue:any,comp){
        let url:string = "categoryLv"+level;
        Promise.all(keyValue.map((key)=>{
            return this.indexDB.remove(url,key);
        })).then(()=>{
            comp.formData["categoryLv"+level] = null;
            this.getCategory(level,comp);
        })
    }

    getProductList(comp){
        let url:string = "product-management";
        this.indexDB.getAll(url).then((data)=>{
            comp.productList = data;
            console.log(data)
        })
    }

    onSave(comp){
        const loading = this.layer.loading();
        let url:string = "product-management";

        this.indexDB.add(url,comp.formData).then(()=>{
            loading.close();
            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succAdd']},()=>{
                comp.detailForm.onReset();
            });
        }).catch(function(error){
            loading.close();
        });
    }

    getDetail(comp){
        let url:string = "product-management";
        this.indexDB.getByKey(url,comp.keyId).then((data:any)=>{
            console.log(data);
            comp.formData = data;
            if(data.categoryLv2){
                this.getCategoryById(2,data.categoryLv1,comp);
            }
            if(data.categoryLv3){
                this.getCategoryById(3,data.categoryLv2,comp);
            }
            if(data.categoryLv4){
                this.getCategoryById(4,data.categoryLv3,comp);
            }
        }).catch(function(error){

        });
    }

    onUpdate(comp){
        let url:string = "product-management";

        this.indexDB.update(url,comp.keyId,comp.formData).then(()=>{
            this.layer.msg({type:"msg_succ",text:comp.globalLabel['tips']['succUpdate']},()=>{
                this.getProductList(comp);
                this.getDetail(comp);
            });
        }).catch(function(error){

        });
    }
}*/
