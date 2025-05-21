import React from 'react';
import { Link } from 'react-router-dom';

const MorePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Successful!</h1>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h2 className="font-semibold text-green-800">Payment Under Review</h2>
            <p className="text-green-600 mt-1">
              We've received your payment details. Our team will verify and notify you shortly.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-blue-800">Next Steps</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-600">
              <li>Check your email for confirmation</li>
              <li>You'll receive notification once verified</li>
              <li>Contact support if you have questions</li>
            </ul>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;