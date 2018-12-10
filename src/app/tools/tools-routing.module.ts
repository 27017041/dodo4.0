/**
 * Created by Leo on 2017/11/23.
 */
import { RouterModule, Routes } from '@angular/router';
import {ToolsComponent} from "./tools.component";
import {SchedulerComponent} from "./scheduler/scheduler.component";
import {ImageComponent} from "./image/image.component";
import {LabelConfigComponent} from "./label-config/label-config.component";
import {ModuleConfigComponent} from "./module-config/module-config.component";
import {ListConfigComponent} from "./list-config/list-config.component";
import {RecycleComponent} from "./recycle/recycle.component";

export const toolsRoutes:Routes = [
    {
        path:'',
        component:ToolsComponent,
        children:[
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'scheduler', component:SchedulerComponent },
            { path: 'image', component:ImageComponent },
            { path: 'label-config', component:LabelConfigComponent },
            { path: 'list-config', component:ListConfigComponent },
            { path: 'module-config', component:ModuleConfigComponent },
            { path: 'recycle', component:RecycleComponent }
        ]
    }
];

export const ToolsRoutingModule = RouterModule.forChild(toolsRoutes);