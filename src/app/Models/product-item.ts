export interface IProductItem {
  id: number,
  name: string,
  imageUrl: string,
  description: string,
  price: number,
  categoryId: number,
  quantity: number,
  attributes: IAttribute[],
  itemAddons: IAddon[],
  itemExtras: IExtra[],
}

export interface IAddon {
  itemId: number,
  name: string,
  price: number,
}

export interface IExtra {
  additionalPrice: number,
  originalPrice: number,
  id: number,
  itemId: number,
  name: string,
  status: number,
}

export interface IAttribute {
  attributeName: string,
  variations: IVariation[],
}

interface IVariation {
  additionalPrice: number,
  id: number,
  itemattributesId: number,
  name: string,
  note: string,
}
