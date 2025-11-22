import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { bookingAPI, paymentAPI } from '../services/api';
import type { Booking } from '../types';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const PaymentForm = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return;
      try {
        const response = await bookingAPI.getById(parseInt(bookingId));
        setBooking(response.data);
      } catch (error) {
        console.error('Failed to load booking:', error);
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !bookingId) return;

    setProcessing(true);

    try {
      // Create payment intent
      const paymentResponse = await paymentAPI.createOrder(parseInt(bookingId));
      const { clientSecret } = paymentResponse.data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend
        await paymentAPI.confirm(paymentIntent.id);
        toast.success('Payment successful!');
        navigate(`/booking/${bookingId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!booking) {
    return <div className="flex items-center justify-center min-h-screen">Booking not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Movie:</span> {booking.show.movieTitle}</p>
              <p><span className="font-semibold">Theater:</span> {booking.show.theaterName}</p>
              <p><span className="font-semibold">Screen:</span> {booking.show.screenName}</p>
              <p><span className="font-semibold">Show Time:</span> {new Date(booking.show.startTime).toLocaleString()}</p>
              <p><span className="font-semibold">Seats:</span> {booking.seats.map(s => s.seatLabel).join(', ')}</p>
              <p className="text-2xl font-bold text-primary mt-4">Total: ₹{booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Card Details</label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay ₹${booking.totalAmount.toFixed(2)}`}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Use test card: 4242 4242 4242 4242
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;

