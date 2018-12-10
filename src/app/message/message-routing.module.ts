/**
 * Created by Leo on 2017/11/23.
 */
import { RouterModule, Routes } from '@angular/router';
import {MessageComponent} from "./message.component";

export const MessageRoutes:Routes = [
    {
        path:'',
        component:MessageComponent
    }
];

export const MessageRoutingModule = RouterModule.forChild(MessageRoutes);