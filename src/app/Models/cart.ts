import { IAddon, IExtra } from "./product-item";

export interface ICart {
  customerId: string,
  deliveryFee: number,
  items: ICartItem[],
  note: string,
  serviceFee: number,
  totalAmount: number,
  subTotal: number,
  voucherCode: number,
  discountAmount: number
}

export interface ICartItem {
  itemName: string,
  itemId: number,
  cartItemId: number,
  imgUrl: string,
  price: number,
  quantity: number,
  variations: IVariation[],
  addons: IAddon[],
  extras: IExtra[],
  notes: string,
}

interface IVariation {
  id: number,
  name: string,
  attributeName: string,
  additionalPrice: number,
}

