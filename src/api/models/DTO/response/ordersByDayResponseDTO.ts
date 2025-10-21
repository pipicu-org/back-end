export interface OrdersByDayResponseDTO {
  day: string;
  total_orders: number;
}

export interface LinesByDayResponseDTO {
  day: string;
  total_orders: number;
}

export interface GmvByDayResponseDTO {
  day: string;
  gmv: number;
}

export interface GmvByContactMethodResponseDTO {
  contactMethod: string;
  gmv: number;
}

export interface GmvByPaymentMethodResponseDTO {
  paymentMethod: string;
  gmv: number;
}

export interface StockByDayResponseDTO {
  day: string;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
}