/**
 * Created by Carson on 2018/5/16.
 */

import {API} from "../../config";

export class AllCronLog{
    logId?:string;
    action?:string;
    msgType?:string;
    sentBy?:string;
    logTime?:string;
    title?:string;
    dateFrom?:string;
    dateTo?:string;
}

export const AllCronLogApi = {
    "getList" : API.api + "/cron/getCronList",
    "getDetail" : API.api + "/message/getMailDetail",
    "onDelete" : API.api + "/user/deleteUser",
}
