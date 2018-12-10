import {Component, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {LayoutService} from "../layout.service";
import {LayerService} from "../../layer/layer.service";
import {LabelService} from "../../util/label.service";

@Component({
    selector: 'my-app-search-overlay',
    styles: [],
    templateUrl: './search-overlay.component.html'
})

export class AppSearchOverlayComponent implements OnInit,AfterViewInit {
    $searchInput;
    keyword: any;
    moduleLabel:any;
    historyList = [];

    constructor(private router: Router,
                private el: ElementRef,
                private layoutService: LayoutService,
                private layer: LayerService,
                private label:LabelService) {
    }

    getLabel() {
        this.label.getModuleLabel('search', this);
    }

    onSearch() {
        if(this.keyword && this.keyword != ""){
            let flag = true;
            for (let h of this.historyList) {
                if (h == this.keyword) {
                    flag = false;
                }
            }
            this.layoutService.updateSearchOverlayState('close');
            if (flag) {
                this.historyList.push(this.keyword);
                window.localStorage.setItem("keyword", this.historyList.toString());
            }
            this.router.navigate(['/app/search', {keyword: this.keyword}]);
        }else{
            this.layoutService.updateSearchOverlayState('close');
            this.router.navigate(['/app/search']);
        }
    }

    onSelectHistory(keyword) {
        this.keyword = keyword;
        this.onSearch();
    }

    removeAll() {
        const dialogRef = this.layer.alert(this.moduleLabel['text']['clearAll'])
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.historyList = [];
                window.localStorage.removeItem("keyword");
            }
        });
    }

    ngAfterViewInit() {
        this.$searchInput = $(this.el.nativeElement).find('#overlay-search-input');
        this.$searchInput.on('keyup', (e) => {
            if (e.keyCode === 13) {
                this.onSearch();
            }
        });
    }

    ngOnInit() {
        this.getLabel();

        let temp: string = window.localStorage.getItem("keyword");
        if (temp) {
            this.historyList = temp.split(",");
        }

    }

}
