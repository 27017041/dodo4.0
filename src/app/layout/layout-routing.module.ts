import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import {GlobalSearchComponent} from "./global-search/global-search.component";

const routes: Routes = [
    {
        path: 'app',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'search', component: GlobalSearchComponent },
            { path: 'administration', loadChildren:'../administration/administration.module#AdministrationModule'},
            { path: 'main', loadChildren:'../main/main.module#MainModule'},
            { path: 'tools', loadChildren:'../tools/tools.module#ToolsModule'},
            { path: 'log', loadChildren:'../log/log.module#LogModule'},
            { path: 'message', loadChildren:'../message/message.module#MessageModule'}
        ]
    }
];

export const LayoutRoutingModule = RouterModule.forChild(routes);
