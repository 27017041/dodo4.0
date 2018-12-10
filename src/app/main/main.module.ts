/**
 * Created by Leo on 2017/11/23.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
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
import { DataTablesModule } from 'angular-datatables';
import {MainComponent} from "./main.component";
import {MainRoutingModule} from "./main-routing.module";
import {ModuleComponent} from "./module/module.component";
import {ModuleService} from "./module/module.service";
import {DialogTreeComponent} from "./dialog/dialog-tree.component";
import {ModuleFormComponent} from "./module/module-form.component";
import {ModuleDatatableService} from "../datatable/datatable-module.service";
import {ModuleDatepickerComponent} from "./datepicker/datepicker.component";
import {ModuleErrorComponent} from "./error/module-error.component";
import {ModuleAutocompleteComponent} from "./autocomplete/autocomplete.component";
import {CompanyComponent} from "./company/company.component";
import {ContactComponent} from "./contact/contact.component";

import {QuotationComponent} from "./quotation/quotation.component";
import {QuotationFormComponent} from './quotation/quotation-form.component';
import {QuotationService} from './quotation/quotation.service';
import {DialogQuotationComponent} from './quotation/dialog/dialog-quotation.component'

import {CompanyFormComponent} from "./company/company-form.component";
import {CompanyService} from "./company/company.service";

/*import {LeadComponent} from './lead/lead.component';
import {LeadFormComponent} from './lead/lead-form.component';
import {LeadService} from './lead/lead.service';
import {DialogUploadFileComponent} from './lead/dialog/dialog-upload-file.component';
import {ExportRecordDirective} from './lead/export-record.directive';
import {ImageUploadDirective} from './lead/import-from-excel.directive';*/

import {ModuleRelationalComponent} from "./module/module-relational.component";
import {ModuleRelationalService} from "../datatable/datatable-relational.service";
import {QuotationLinkageComponent} from "./quotation/dialog/quotation-linkage.component";
import {SharedModule} from "../shared/shared.module";
import {ModuleTabsCloseDirective} from "./module/module-tabs-close.directive";


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
        DataTablesModule,
        SharedModule,
        MainRoutingModule,
    ],
    exports: [],
    entryComponents:[
        DialogTreeComponent,
        /*DialogUploadFileComponent,*/
        ModuleRelationalComponent,
        DialogQuotationComponent,
        QuotationFormComponent,
        QuotationLinkageComponent,
    ],
    declarations: [
        MainComponent,
        ModuleComponent,
        ModuleFormComponent,
        DialogTreeComponent,
        ModuleDatepickerComponent,
        ModuleErrorComponent,
        ModuleAutocompleteComponent,
        CompanyComponent,
        CompanyFormComponent,
        ContactComponent,

        /*LeadComponent,
        LeadFormComponent,
        ExportRecordDirective,
        ImageUploadDirective,
        DialogUploadFileComponent,*/

        QuotationComponent,
        QuotationFormComponent,
        DialogQuotationComponent,
        QuotationLinkageComponent,

        ModuleRelationalComponent,
        ModuleTabsCloseDirective
    ],
    providers: [
        ModuleDatatableService,
        ModuleRelationalService,
        ModuleService,
        CompanyService,
        /*LeadService,*/
        QuotationService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule { }

