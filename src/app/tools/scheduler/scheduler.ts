/**
 * Created by Leo on 2018/1/18.
 */
import {API} from "../../config";

export const SchedulerApi = {
    "getCronList" : API.api + "/cron/getCronList",
    "getDetail" : API.api + "/cron/getDetail",
    "addCron" : API.api + "/cron/saveCron",
    "deleteCron" : API.api + "/cron/deleteCron",
    "updateCron" : API.api + "/cron/updateCron"
}

export class Scheduler{
    cronId?:number;
    cronName?:string;
    monthDay?:string;
    weekDay?:string;
    hourDay?:string;
    minuteHour?:string;
    lastRun?:string;
    createDate?:string;
    className?:string;
    methodName?:string;
    paramName?:string;
    retentionTime?:string;
}
