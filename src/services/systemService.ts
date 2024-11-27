import { http } from "../util/api";

export const SystemService = {
    getTrans: (month: number, year: number, userId?: number) => {
        const url = userId ? `trans/${month}/${year}/${userId}` : `trans/${month}/${year}`;
        return http.get(url);
      },      
    getSystem: () => {
        return http.get(`trans/system`);
    }

}