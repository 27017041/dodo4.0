/**
 * Created by Leo on 2017/11/23.
 */
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
import { DataTablesModule } from 'angular-datatables';

import {AdministrationComponent} from "./administration.component";
import {AdministrationRoutingModule} from "./administration-routing.module";
import {RoleComponent} from "./role/role.component";
import {UserComponent} from "./user/user.component";
import {AssignComponent} from "./assign/assign.component";
import {RoleService} from "./role/role.service";
import {RoleFormComponent} from "./role/role-form.component";
import {AssignService} from "./assign/assign.service";
import {UserService} from "./user/user.service";
import {UserFormComponent} from "./user/user-form.component";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginComponent} from "./login/login.component";
import {SharedModule} from "../shared/shared.module";


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
        AdministrationRoutingModule
    ],
    exports: [
        UserFormComponent
    ],
    declarations: [
        AdministrationComponent,
        RoleComponent,
        RoleFormComponent,
        UserComponent,
        UserFormComponent,
        AssignComponent,
        RegistrationComponent,
        LoginComponent,
    ],
    providers: [
        RoleService,
        AssignService,
        UserService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministrationModule { }

