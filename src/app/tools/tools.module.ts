/**
 * Created by Leo on 2017/11/23.
 */
import { NgModule } from '@angular/core';
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
import { SortablejsModule } from 'angular-sortablejs/dist'
import { DataTablesModule } from 'angular-datatables';

import {ToolsComponent} from "./tools.component";
import {ToolsRoutingModule} from "./tools-routing.module";
import {SchedulerComponent} from "./scheduler/scheduler.component";
import {ImageComponent} from "./image/image.component";
import {LabelConfigComponent} from "./label-config/label-config.component";
import {ModuleConfigComponent} from "./module-config/module-config.component";
import {ModuleConfigService} from "./module-config/module-config.service";
import {ModuleFieldConfigComponent} from "./module-config/module-field-config.component";
import {DialogAddConfigComponent} from "./module-config/dialog/dialog-add-config.component";
import {ListConfigComponent} from "./list-config/list-config.component";
import {ListConfigService} from "./list-config/list-config.service";
import {DialogItemListComponent} from "./list-config/dialog/dialog-list-item.component";
import {ListConfigFormComponent} from "./list-config/list-config-form.component";
import {LabelConfigService} from "./label-config/label-config.service";
import {LabelConfigFormComponent} from "./label-config/label-config-form.component";
import {SchedulerService} from "./scheduler/scheduler.service";
import {ImageService} from "./image/image.service";
import {DialogAddSettingComponent} from "./image/dialog/dialog-add-setting.component";
import {SchedulerFormComponent} from "./scheduler/scheduler-form.component";
import {ImageUploadDirective} from "./image/image-upload.directive";
import {RecycleComponent} from "./recycle/recycle.component";
import {DialogAddRelationalComponent} from "./module-config/dialog/dialog-add-relational.component";
import {DialogAddRelationalItemComponent} from "./module-config/dialog/dialog-add-relational-item.component";


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
        ToolsRoutingModule
    ],
    exports: [],
    declarations: [
        ToolsComponent,
        SchedulerComponent,
        SchedulerFormComponent,
        ImageComponent,
        LabelConfigComponent,
        ListConfigComponent,
        ModuleConfigComponent,
        ModuleFieldConfigComponent,
        DialogAddConfigComponent,
        DialogItemListComponent,
        DialogAddSettingComponent,
        ListConfigFormComponent,
        LabelConfigFormComponent,
        ImageUploadDirective,
        RecycleComponent,
        DialogAddRelationalComponent,
        DialogAddRelationalItemComponent,
    ],
    entryComponents:[
        DialogAddConfigComponent,
        DialogItemListComponent,
        DialogAddSettingComponent,
        DialogAddRelationalComponent,
        DialogAddRelationalItemComponent,
    ],
    providers: [
        ModuleConfigService,
        ListConfigService,
        LabelConfigService,
        SchedulerService,
        ImageService,
    ],
})
export class ToolsModule { }

