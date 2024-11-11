import { http } from "../util/api";

export const UserService = {
  getUser: () => {
    return http.get("user");
  },
  getAllUser: () => {
    return http.get("user/get-all");
  },
  updateUserByAdmin: (id:number,data?:{
    fullName?: string,
    status?: number,
  }) => {
    return http.patch(`user/update-by-admin/${id}`,data)
  },
  updatePrice: (data:{price:number,playerId:number,message:string}) => {
    return http.patch(`user/update-price`,data)
  },
  changePassword: (data: { newPassword: string,oldPassword: string }) => {
    return http.patch("user/change-password", data);
  },
  updateUser:(data:any) => {
    return http.patch("user", data);
  }
}
