/**
 * Created by Leo on 2017/11/23.
 */
import {NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {SortablejsModule} from 'angular-sortablejs/dist'
import {DataTablesModule} from 'angular-datatables';
import {LogRoutingModule} from "./log-routing.module";
import {LogComponent} from "./log.component";
import {LoginLogComponent} from "./login-log/login-log.component";
import {ObjLogComponent} from "./obj-log/obj-log.component";
import {TaskLogComponent} from "./task-log/task-log.component";
import {TaskLogFormComponent} from "./task-log/task-log-form.component";
import {AllTaskLogFormComponent} from "./task-log/all-task-log.component";
import {TaskLogService} from "./task-log/task-log.service";
import {AllCronLogComponent} from "./all-cron-log/all-cron-log.component"
import {AllCronLogService} from "./all-cron-log/all-cron-log.service"
import {SharedModule} from "../shared/shared.module";
import {EmailLogComponent} from "./email-log/email-log.component";
import {EmailLogFormComponent} from "./email-log/email-log-form.component";
import {EmailLogService} from "./email-log/email-log.service";



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
        SortablejsModule,
        DataTablesModule,
        SharedModule,
        LogRoutingModule,
    ],
    exports: [],
    declarations: [
        LogComponent,
        LoginLogComponent,
        ObjLogComponent,
        EmailLogComponent,
        EmailLogFormComponent,
        TaskLogComponent,
        TaskLogFormComponent,
        AllTaskLogFormComponent,
        AllCronLogComponent
    ],
    entryComponents: [],
    providers: [
        EmailLogService,
        TaskLogService,
        AllCronLogService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogModule {
}

