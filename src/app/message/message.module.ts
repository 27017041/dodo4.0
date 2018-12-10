/**
 * Created by Leo on 2017/11/23.
 */
import { NgModule } from '@angular/core';
import {MessageRoutingModule} from "./message-routing.module";
import {MessageComponent} from "./message.component";


@NgModule({
    imports: [
        MessageRoutingModule
    ],
    exports: [],
    declarations: [
        MessageComponent
    ],
    providers: [],
})
export class MessageModule { }

