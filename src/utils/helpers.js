import { v4 as uuidv4 } from 'uuid';

export const generateOrderId = () => {
  return `FR-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
};

export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const sanitizeInput = (str) => {
  return str.replace(/[<>]/g, '');
};