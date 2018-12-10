/**
 * Created by Carson on 2018/5/10.
 */

import {API} from "../../config";

export class TaskLog{
    logId?:string;
    cronId?:number;
    cronLogId?:number;
    endTime?:string;
    startTime?:string;
    position?:string;
    taskName?:string;
    frequencyType?:string;
    logTime?:string;
    log?:string;
    cronName?:string;
    status?:string;
}

export const TaskLogApi = {
    "getList" : API.api + "/cron/getCronLogList",
    "getDetail" : API.api + "/cron/getCronLogDetail",
    "onDelete" : API.api + "/user/deleteUser",
} 