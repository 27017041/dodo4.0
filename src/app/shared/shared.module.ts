import {NgModule} from '@angular/core';

import {EChartsDirective} from './echarts.directive';
import {SlimScrollDirective} from './slim-scroll.directive';
import {MinheightDirective} from "./minheight.directive";
import {TabsCloseDirective} from "./tabs-close.directive";

@NgModule({
    imports: [],
    declarations: [
        EChartsDirective,
        SlimScrollDirective,
        MinheightDirective,
        TabsCloseDirective,
    ],
    exports: [
        EChartsDirective,
        SlimScrollDirective,
        MinheightDirective,
        TabsCloseDirective,
    ]
})

export class SharedModule {
}
