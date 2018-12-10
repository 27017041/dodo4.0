/**
 * Created by Leo on 2017/11/23.
 */
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main.component";
import {ModuleComponent} from "./module/module.component";
import {CompanyComponent} from "./company/company.component";
import {ContactComponent} from "./contact/contact.component";
import {QuotationComponent} from "./quotation/quotation.component";

export const MainRoutes:Routes = [
    {
        path:'',
        component:MainComponent,
        children:[
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            {
                path: 'company',
                component: ModuleComponent,
                data:{ moduleName:'company'}
            },
            {
                path: 'client',
                component: ModuleComponent,
                data:{ moduleName:'client'}
            },
            {
                path: 'contact',
                component: ModuleComponent,
                data:{ moduleName:'contact'}
            }, 
            {
                path: 'quotation',
                component: QuotationComponent
            }
        ]
    }
];

export const MainRoutingModule = RouterModule.forChild(MainRoutes);