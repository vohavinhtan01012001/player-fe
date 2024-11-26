import { http } from "../util/api";

export const SystemService = {

    getTrans: (month: number,year:number)  => {
        return http.get(`trans/${month}/${year}`);
    },
    getSystem: () => {
        return http.get(`trans/system`);
    }

}