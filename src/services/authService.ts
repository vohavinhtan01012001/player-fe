import { LoginForm } from "../pages/auth/components/login/Login";
import { RegisterRequest } from "../pages/auth/components/register/Register";
import { http, httpInstance } from "../util/api";

export const AuthService = {
  register: (data:RegisterRequest) => {
    return http.post("auth/register", data);
  },
  login: (data:LoginForm) => {
    return http.post("auth/login", data);
  },
  logout: () => {
    httpInstance.removeBearerToken();
    localStorage.removeItem('accessToken');
  }
}
