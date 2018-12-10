/**
 * Created by Carson on 2018/5/10.
 */

import {API} from "../../config";

export class EmailLog{
    logId?:string;
    action?:string;
    msgType?:string;
    sentBy?:string;
    logTime?:string;
    title?:string;
    dateFrom?:string;
    dateTo?:string;
    mailSubject?:string;
    mailFrom?:string;
    mailTo?:string;
    mailCc?:string;
    insertDate?:string;
    mailContent?:string;
    sendType?:string;
    status?:string;
}

export const EmailLogApi = {
    "getList" : API.api + "/message/getMailList",
    "getDetail" : API.api + "/message/getMailDetail",
}