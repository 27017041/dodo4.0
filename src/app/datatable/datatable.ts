
/**
 * Created by Leo on 2017/12/6.
 */

export class DtOption{
    public hasSelect?: boolean;
    public hasLink?: boolean;
    public hasDelete?: boolean;
    public hasHistory?: boolean;
    public hasAction?: boolean;
    public order?: any;
    public iDisplayLength?:number;
    public ajax?:OptionAjax;
    public columns?:Array<OptionColumns>;
    public relationalFields?:Array<RelationalField>;
}

class OptionAjax{
    public url?:string;
    public data?:any;
    public moduleName?:string;
}

class OptionColumns{
    public isSelect?:boolean;//是否选择框
    public isLink?:boolean;//是否连接
    public keyField?:string;// key 值
    public data?:any;// 显示的数据的filed，对应java 实体类
    public name?:string;// 传给后台的filed
    public orderable?:boolean;//是否排序
    public visible?:boolean;//是否显示
    public fieldType?:string;// 字段类型 text,select,date etc.
    public textOverflow?:boolean;//文本溢出处理，默认false 不处理，true 加省略号
    public format?:string;// 日期格式化 比如"YYYY-MM-DD"
    public curSymbol?:string;// 货币类型 默认“USD”
    public isAction?:boolean;//是否是操作
    public actionOpt?:Array<ActionOpt>;
}

class ActionOpt{
    label?:string;//action  文本
    fnName?:string;//回调函数名
    argName?:Array<string>;//参数名
    className?:string;//样式名字
}

class Relational{
    moduleName?:string;
    relationalName?:string;
    tableName?:string;
    tableField?:string;
    tableKey?:string;
}

class RelationalField{
    relationalId?:number;
    fieldName?:string;
    sort?:number;
    isLink?:number;
    linkUrl?:string;
    isDelete?:number;
    deleteUrl?:string;
    isHistory?:number;
    historyUrl?:string;
    isDisplay?:number;
    moduleName?:string;
    relationalName?:string;
    tableName?:string;
    tableField?:string;
    tableKey?:string;
    orderable?:boolean;
}





