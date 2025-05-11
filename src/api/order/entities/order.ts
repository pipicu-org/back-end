import { Line } from '.';

export interface Order {
  id: string;
  lines: Line[];
  createdAt: Date;
}

export const orders: Order[] = [];
