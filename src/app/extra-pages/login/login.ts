import {API} from "../../config";
/**
 * Created by Leo on 2017/11/23.
 */

export const LoginApi = {
    "login" : API.api + "/user/signIn"
}

export class Login{
    constructor(
        public email?:string,
        public password?:string
    ){}
}