import { http } from "../util/api";

export const FollowerService = {
  // Lấy tất cả followers
  getFollowers: () => {
    return http.get("follower");
  },

  // Tạo mới follower
  createFollower: (data: { userId: number; playerId: number }) => {
    return http.post("follower/add-follower", data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Cập nhật follower
  updateFollower: (id: number, data: { userId?: number; playerId?: number }) => {
    return http.put(`follower/update-follower/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Xóa follower
  deleteFollower: (id: number) => {
    return http.delete(`follower/delete-follower/${id}`);
  },

  getTopPlayer: (month: number,year:number) => {
    return http.get(`follower/top-player/${month}/${year}`);
  },
};
