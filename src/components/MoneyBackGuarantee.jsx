import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Heart } from 'lucide-react';

const MoneyBackGuarantee = ({ currency = 'GBP' }) => {
  const navigate = useNavigate();

  // Currency data
  const currencyData = {
    GBP: { symbol: '£', name: 'British Pound' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background animations with darker colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#8129D7]/10 to-gray-900">
        <div className="absolute w-[600px] h-[600px] bg-[#8129D7]/15 rounded-full blur-[120px] top-[-200px] left-[-200px] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-[#03AD9C]/15 rounded-full blur-[120px] bottom-[-200px] right-[-200px] animate-pulse animation-delay-2000" />
        <div className="absolute w-[600px] h-[600px] bg-[#2A5EDB]/15 rounded-full blur-[120px] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <button
            onClick={() => navigate(`/${currency === 'GBP' ? 'UK' : currency === 'USD' ? 'US' : 'EU'}/scale`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 text-white font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scale Promotion
          </button>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#8129D7]/30 to-[#03AD9C]/30 border border-white/20 mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
              100% Money-Back Guarantee
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Your satisfaction is our priority. We stand behind our service with a no-questions-asked guarantee.
          </p>
        </motion.div>

        {/* Guarantee Details */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 p-8 md:p-12 mb-12 shadow-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Promise to You</h2>
          
          <div className="space-y-6 text-white/80 text-lg leading-relaxed">
            <p>
              <strong className="text-white">If you pay the deposit and you are not happy with the contract before kick-off, 
              we will refund your deposit—no questions asked.</strong>
            </p>
            
            <p>
              We understand that choosing a sales and marketing partner is a significant decision. That's why we've made 
              it risk-free for you to get started with our Scale plan.
            </p>
            
            <p>
              After paying your 20% deposit, you'll have the opportunity to review our detailed contract and discuss 
              your specific requirements with our team. If at any point before the kick-off call you decide our services 
              aren't the right fit for your business, simply let us know and we'll process a full refund of your deposit.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">How It Works:</h3>
            <div className="space-y-4">
              {[
                'Pay your 20% deposit to reserve your spot',
                'Review the contract and discuss your requirements',
                'If not satisfied before kick-off, request a refund',
                'Receive 100% of your deposit back within 5-7 business days'
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-white/10 mb-8">
            <Heart className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Trusted by 500+ businesses worldwide</span>
          </div>
          
          <p className="text-white/60 mb-8">
            We're confident in our ability to deliver exceptional results. This guarantee reflects our commitment 
            to your success and ensures you can make an informed decision without financial risk.
          </p>
          
          <motion.button
            onClick={() => navigate(`/${currency === 'GBP' ? 'UK' : currency === 'USD' ? 'US' : 'EU'}/scale`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#8129D7] to-[#2A5EDB] hover:from-[#9747FF] hover:to-[#4C7AE6] text-white font-bold text-lg shadow-lg transition-all duration-300"
          >
            Get Started Risk-Free
          </motion.button>
          
          <p className="text-xs text-white/40 mt-6">
            This guarantee applies to the initial deposit payment only and is valid before the kick-off call commences. 
            Standard terms and conditions apply.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MoneyBackGuarantee;