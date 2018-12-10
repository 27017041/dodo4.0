/**
 * Created by Carson on 2018/5/23.
 */
import {API} from "../../config";

let fieldArr = new Array();
function field(target, propertyKey: string) {
    // target: 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    // propertyKey: 成员的名字
    fieldArr.push(propertyKey)
}
export class Quotation {
    @field quotationId?: number;
    @field quotationNo?: string;
    @field quotationName?: string;
    @field paymentPercent?: string;
    @field prepareBy?: string;
    @field discount?: string;
    @field contactEmail?: string;
    @field clientEmail?: string;
    @field createDate?: string;
    @field currency?: number;
    @field currencyName?: string;
    @field roleId?: string;
    @field status?: number;
    @field expiryDate?: string;
    @field title?: string;
    @field clientName?: string;
    @field clientId?: number;
    @field companyName?:string;
    @field companyId?:number;
    @field contactId?: number;
    @field contactName?: string;
    @field linkageModule?:string;
    getField(){
        return fieldArr;
    }
}

export class QuotationItem {
    temp?: string;
    titleId?: number;
    title?: string;
    description?: string;
    cost?: number;
    unitPrice?: number;
    qty?: number;
    discount?: string;
    disc?: string;
    parentId?: number;
    sort?: string;
    optional?: number;
    unitCost?: number;
    subTotal?: number;
    supplier?: string;
    createTime?: string;
    EuShipDate?: string;
    officeShipDate?: string;
}

export const QuotationApi = {
    "getRoleList": API.api + "/menuRole/getRoleSelectData",
    "getList": API.api + "/quotation/getQuotationList",
    "submit": API.api + "/quotation/submit",

    "createItem": API.api + "/quotation/createItem",
    "getQuotationItemList": API.api + "/quotation/getQuotationItemList",
    "updateItem": API.api + "/quotation/updateItem",
    "deleteItem": API.api + "/quotation/deleteItem",

    "printPDF": API.api + "/quotation/printPDF",
    "getDetail": API.api + "/quotation/getDetail",
    "getClientList": API.api + "/client/getClient",
    "getContactList": API.api + "/contact/getDatasourse",
    "getCurrency": API.api + "/quotation/getcurrency",
    "saveFooter": API.api + "/quotation/saveFooter",
    "onSave": API.api + "/quotation/saveData",
    "onUpdate": API.api + "/quotation/updateData",
    "onDelete": API.api + "/quotation/deleteData",

    "getLinkageModuleList" : API.api + "/relational/getLinkageModuleList",
    "getLinkageModuleListById" : API.api + "/relational/getLinkageModuleListById"

}
/**
 * 设置关联数据
 * **/
export const QuotationalRelational = [
    {
        moduleName: "quotation", relationalName: "emailHistory", tableField: "quotationId",
        tableKey: "emailHistoryId", tableName: "v_obj_email_history"
    },
    {
        moduleName: "quotation", relationalName: "contract", tableField: "quotationId",
        tableKey: "contractId", tableName: "v_obj_contract"
    },
    {
        moduleName: "quotation", relationalName: "invoice", tableField: "quotationId",
        tableKey: "invoiceId", tableName: "v_obj_invoice"
    },
    {
        moduleName: "quotation", relationalName: "payment", tableField: "quotationId",
        tableKey: "paymentId", tableName: "v_obj_payment"
    }
]

export const QuotationalRelationalItem = [
    [
        {
            fieldName: "emailHistoryId", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 1,
            linkUrl: "emailHistory/getDetail"
        },
        {
            fieldName: "subject", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "module", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "objTitle", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "createDate", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "status", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        }
    ],
    [
        {
            fieldName: "contractId", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 1,
            linkUrl: "contract/getDetail"
        },
        {
            fieldName: "contractNo", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "title", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "quotationNo", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "clientName", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "startDate", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "endDate", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "remark", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "status", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        }
    ],
    [
        {
            fieldName: "invoiceId", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 1,
            linkUrl: "invoice/getDetail"
        },
        {
            fieldName: "invoiceNo", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "amount", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "balance", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "payment", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "date", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "statusName", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        }
    ],
    [
        {
            fieldName: "paymentId", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 1,
            linkUrl: "payment/getDetail"
        },
        {
            fieldName: "paymentNo", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "date", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "clientName", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "quotation", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "method", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "totalAmount", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        },
        {
            fieldName: "staff", isDelete: 0, isDisplay: 0, isHistory: 0, isLink: 0
        }
    ]
]