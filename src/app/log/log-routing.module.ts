/**
 * Created by Leo on 2017/11/23.
 */
import { RouterModule, Routes } from '@angular/router';
import {LogComponent} from "./log.component";
import {LoginLogComponent} from "./login-log/login-log.component";
import {ObjLogComponent} from "./obj-log/obj-log.component";
import {TaskLogComponent} from "./task-log/task-log.component";
import {AllCronLogComponent} from "./all-cron-log/all-cron-log.component";
import {EmailLogComponent} from "./email-log/email-log.component";


export const logRoutes:Routes = [
    {
        path:'',
        component:LogComponent,
        children:[
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'login-log', component:LoginLogComponent },
            { path: 'obj-log', component:ObjLogComponent },
            { path: 'email-log', component:EmailLogComponent },
            { path: 'task-log', component:TaskLogComponent },
            /*{ path: 'all-cron-log', component:AllCronLogComponent },*/
        ]
    }
];

export const LogRoutingModule = RouterModule.forChild(logRoutes);