/**
 * Created by Leo on 2017/10/23.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {API} from '../config';

@Injectable()
export class LabelService {
    globalLabel: any;

    private globalLabelSubject: Subject<any> = new Subject<any>();
    globalLabel$ = this.globalLabelSubject.asObservable();

    private moduleLabelSubject: Subject<any> = new Subject<any>();
    moduleLabel$ = this.moduleLabelSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    setGlobalLabel(label) {
        this.globalLabel = label;
        this.globalLabelSubject.next(label);
    }

    getGlobalLabel(comp) {
        if(this.globalLabel){
            comp.globalLabel = this.globalLabel;
        }else{
            this.globalLabel$.subscribe((data) => {
                comp.globalLabel = data;
            })
        }
    }

    getGlobalLabelFormSignIn(comp) {
        this.http
            .get(API.api + "/label/getGlobalLabel")
            .subscribe((data: any) => {
                this.setGlobalLabel(data.label);
                comp.globalLabel = data.label;
            });
    }

    getModuleLabel(module, comp) {
        this.http
            .post(API.api + "/label/getLabel", $.param({module: module}), {headers: API.form})
            .subscribe((data: any) => {
                comp.moduleLabel = data.label;
                this.moduleLabelSubject.next(module);
            });
    }
}
