import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface LoginCase {
  title: string;
  username: string;
  password: string;
  expectedError: string;
  errorField: 'username' | 'password';
}

export interface ProductCase {
  name: string;
  price: string;
  descriptionIncludes: string;
}

export interface CatalogProduct {
  name: string;
  price: string;
  descriptionIncludes?: string;
}

export interface CheckoutData {
  shipping: {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment: {
    name: string;
    cardNumber: string;
    expiration: string;
    securityCode: string;
  };
}

interface CatalogFile {
  backpack: CatalogProduct;
  priceAscendingFirst: CatalogProduct;
  nameDescendingFirst: CatalogProduct;
  details: ProductCase[];
}

function readJson<T>(fileName: string): T {
  const file = path.resolve('test/data', fileName);
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

export const loginCases = readJson<LoginCase[]>('users.json');
export const catalog = readJson<CatalogFile>('products.json');
export const checkoutData = readJson<CheckoutData>('checkout.json');
