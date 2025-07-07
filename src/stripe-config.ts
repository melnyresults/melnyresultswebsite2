export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SCCWWk9sMJNzSC',
    priceId: 'price_1RHo7lRoGKTuFXtOpnK24v5L',
    name: 'Get My GEO Audit Now',
    description: 'Comprehensive geographical audit to optimize your local marketing presence and drive more targeted leads.',
    mode: 'payment',
    price: 997.00,
    currency: 'usd'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};