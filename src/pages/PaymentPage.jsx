import React from 'react';
import PaymentForm from '../components/PaymentForm';

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Make a Payment</h1>
        <div className="max-w-md mx-auto">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;