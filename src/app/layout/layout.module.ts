import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
} from '@angular/material';

import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import {MenuService} from "../util/menu.service";
import {LabelService} from "../util/label.service";
import {LogService} from "../util/log.service";
import {UtilService} from "../util/util.service";
import {LayerService} from "../layer/layer.service";
import {DatatableService} from "../datatable/datatable.service";
import {CookieService} from "../util/cookie.service";
import {SessionService} from "../util/session.service";
import {GlobalSearchComponent} from "./global-search/global-search.component";
import {AdministrationModule} from "../administration/administration.module";
import {GlobalSearchService} from "./global-search/global-search.service";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatStepperModule,
        LayoutRoutingModule,
        SharedModule,
        DataTablesModule,
        AdministrationModule,
    ],
    declarations:[
        GlobalSearchComponent
    ],
    providers:[
        UtilService,
        MenuService,
        LabelService,
        LogService,
        LayerService,
        DatatableService,
        CookieService,
        SessionService,
        GlobalSearchService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LayoutModule {}
