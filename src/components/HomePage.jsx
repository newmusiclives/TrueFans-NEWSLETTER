import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckIcon, SparklesIcon } from './Icons';

const HomePage = ({ genres, setActiveTab, onShowAuth }) => {
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const toggleNewsletter = (genreId) => {
    setSelectedNewsletters(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (selectedNewsletters.length === 0) {
      setSubscribeStatus('Please select at least one newsletter');
      return;
    }
    if (!email) {
      setSubscribeStatus('Please enter your email');
      return;
    }

    setSubscribeStatus('Subscribing...');

    try {
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .upsert({ email, status: 'active' }, { onConflict: 'email' })
        .select()
        .single();

      if (subscriberError) throw subscriberError;

      const { data: newslettersData } = await supabase
        .from('newsletters')
        .select('id, slug')
        .in('slug', selectedNewsletters);

      if (newslettersData && newslettersData.length > 0) {
        const subscriptions = newslettersData.map(newsletter => ({
          subscriber_id: subscriber.id,
          newsletter_id: newsletter.id,
          status: 'subscribed'
        }));

        const { error: subscriptionError } = await supabase
          .from('newsletter_subscriptions')
          .upsert(subscriptions, { onConflict: 'subscriber_id,newsletter_id' });

        if (subscriptionError) throw subscriptionError;
      }

      setSubscribeStatus(`Successfully subscribed to ${selectedNewsletters.length} newsletter${selectedNewsletters.length > 1 ? 's' : ''}!`);
      setEmail('');
      setSelectedNewsletters([]);
      setTimeout(() => setSubscribeStatus(''), 3000);
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('Error subscribing. Please try again.');
      setTimeout(() => setSubscribeStatus(''), 3000);
    }
  };

  const genreCategories = [
    {
      title: 'Music Genres',
      icon: '🎵',
      newsletters: genres.filter(g =>
        ['pulse', 'storyteller', 'voltage', 'resonance', 'amplify', 'rhythm', 'underground', 'country'].includes(g.id)
      )
    },
    {
      title: 'Songwriting',
      icon: '✍️',
      newsletters: genres.filter(g => ['pencraft', 'hitmaker'].includes(g.id))
    },
    {
      title: 'Music Business',
      icon: '💼',
      newsletters: genres.filter(g => ['executive', 'revenue'].includes(g.id))
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 rounded-2xl p-12 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
            <SparklesIcon className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Music Intelligence</span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            The Future of Music Discovery
          </h1>

          <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
            Subscribe to the newsletters that matter to you. Get AI-curated insights on emerging artists,
            songwriting craft, and the business of music delivered to your inbox.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">12</div>
              <div className="text-orange-50">Specialized Newsletters</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">170K+</div>
              <div className="text-orange-50">Total Subscribers</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">89.7%</div>
              <div className="text-orange-50">AI Confidence Score</div>
            </div>
          </div>

          <button
            onClick={() => {
              document.getElementById('subscribe-section').scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 font-semibold text-lg transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Discovery</h3>
          <p className="text-gray-600">
            Our AI scans thousands of sources daily to discover emerging artists before they break mainstream.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Content</h3>
          <p className="text-gray-600">
            Subscribe to only the newsletters you care about. Mix genres, songwriting, and business intel.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Intelligence</h3>
          <p className="text-gray-600">
            Deep insights into trends, deals, and opportunities across the entire music industry.
          </p>
        </div>
      </div>

      {/* Newsletter Categories */}
      <div id="subscribe-section" className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Newsletters</h2>
          <p className="text-xl text-gray-600">Select the topics that matter most to you</p>
        </div>

        {genreCategories.map((category) => (
          <div key={category.title} className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                <span className="text-gray-500">({category.newsletters.length})</span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.newsletters.map(genre => (
                  <div
                    key={genre.id}
                    onClick={() => toggleNewsletter(genre.id)}
                    className={`relative rounded-lg p-4 cursor-pointer transition-all border-2 ${
                      selectedNewsletters.includes(genre.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {selectedNewsletters.includes(genre.id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{genre.emoji}</span>
                      <div className="text-right text-xs text-gray-600">
                        <div>{genre.day}</div>
                        <div>{genre.time}</div>
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-1">{genre.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{genre.label}</p>
                    <p className="text-xs text-gray-700 line-clamp-2">{genre.description}</p>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{genre.subscribers.toLocaleString()} subs</span>
                        <span>{genre.engagement.toFixed(1)}% engaged</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe Form */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">
            {selectedNewsletters.length > 0
              ? `You've selected ${selectedNewsletters.length} newsletter${selectedNewsletters.length > 1 ? 's' : ''}. Enter your email to subscribe.`
              : 'Select your newsletters above and enter your email below.'}
          </p>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 font-semibold transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </div>

            {subscribeStatus && (
              <div className={`text-sm ${subscribeStatus.includes('Success') ? 'text-green-300' : 'text-orange-300'}`}>
                {subscribeStatus}
              </div>
            )}
          </form>

          <p className="text-gray-400 text-sm mt-6">
            Free to subscribe. Unsubscribe anytime. No spam, ever.
          </p>
        </div>
      </div>

      {/* Platform Access */}
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Looking for Platform Access?</h3>
        <p className="text-gray-600 mb-6">
          Industry professionals can access our full platform with advanced analytics, automation, and admin tools.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default HomePage;
