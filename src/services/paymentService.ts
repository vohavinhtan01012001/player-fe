import { http } from "../util/api";

export const PaymentService = {
  payment: (amount:number) => {
    return http.post(`payment`,{amount});
    },
  paymentVnpayCheck: (vnp_Params:any) => {
      return http.post(`payment/vnpay-check`,{vnp_Params});
  }
}