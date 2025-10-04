import React from 'react';
import { CheckIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

const PricingPage = ({ onShowAuth }) => {
  const { user, profile } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for music fans who want to stay informed',
      features: [
        'Subscribe to unlimited newsletters',
        'Email delivery',
        'Newsletter archive access',
        'Basic profile management',
        'Unsubscribe anytime'
      ],
      cta: 'Get Started',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Premium',
      price: 20,
      period: 'month',
      description: 'For industry professionals who need the edge',
      features: [
        'All Free features',
        'Full dashboard access',
        'Advanced analytics with export',
        '48hr early artist access',
        'API access for integration',
        'Custom digest scheduling',
        'Priority support',
        'Remove branding',
        'Advanced filtering and search'
      ],
      cta: 'Upgrade to Premium',
      popular: true,
      color: 'orange'
    },
    {
      name: 'Enterprise',
      price: 200,
      period: 'month',
      description: 'For labels and publishers who need white-label control',
      features: [
        'All Premium features',
        'White-label newsletters',
        'Custom AI model training',
        'Dedicated account manager',
        'Bulk artist discovery alerts',
        'Integration with industry tools',
        'Advanced reporting',
        '5 user seats included',
        'Custom contract terms'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'gray'
    }
  ];

  const handleCTAClick = (plan) => {
    if (plan.name === 'Free') {
      if (!user) {
        onShowAuth('signup');
      }
    } else if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:enterprise@truefans.com?subject=Enterprise Inquiry';
    } else {
      if (!user) {
        onShowAuth('signup');
      } else {
        alert('Payment integration coming soon! You would be upgraded to ' + plan.name);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Plan</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade when you need professional tools for music discovery and intelligence
        </p>
      </div>

      {user && profile && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-900">Current Plan</h3>
              <p className="text-blue-700 capitalize">{profile.role === 'subscriber' ? 'Free' : profile.role}</p>
            </div>
            {profile.role === 'subscriber' && (
              <button
                onClick={() => handleCTAClick(plans[1])}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
              plan.popular ? 'border-orange-500' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600 ml-2">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCTAClick(plan)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600">
              We accept all major credit cards and can arrange invoicing for Enterprise customers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Is there a contract for Premium?</h4>
            <p className="text-gray-600">
              No, Premium is month-to-month with no long-term commitment. Cancel anytime.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What if I need more than 5 seats?</h4>
            <p className="text-gray-600">
              Contact our Enterprise team for custom pricing on additional seats and features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
