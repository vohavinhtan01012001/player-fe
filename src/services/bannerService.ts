import { http } from "../util/api";

export const BannerService = {
  getBanners: () => {
    return http.get("banner");
  },
  createBanner: (data: any) => {
    return http.post("banner/add-banner", data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateBanner: (id: number, data: { image?: string; title?: string,status?:number }) => {
    return http.put(`banner/update-banner/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteBanner: (id: number) => {
    return http.delete(`banner/delete-banner/${id}`);
  },
};
