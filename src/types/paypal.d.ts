declare module '@paypal/react-paypal-js' {
  import { ReactNode } from 'react';

  export interface PayPalScriptOptions {
    clientId: string;
    currency?: string;
    intent?: 'capture' | 'authorize';
    [key: string]: any;
  }

  export interface PayPalScriptProviderProps {
    options: PayPalScriptOptions;
    children: ReactNode;
  }

  export interface PayPalButtonsProps {
    createOrder?: (data: any, actions: any) => Promise<string>;
    onApprove?: (data: any, actions: any) => Promise<void>;
    onError?: (error: any) => void;
    style?: {
      layout?: string;
      color?: string;
      shape?: string;
      label?: string;
    };
  }

  export const PayPalScriptProvider: React.FC<PayPalScriptProviderProps>;
  export const PayPalButtons: React.FC<PayPalButtonsProps>;
}