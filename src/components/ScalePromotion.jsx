import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Plus, X, ArrowLeft, Clock, Zap, Target, Users,
  MessageCircle, TrendingUp, Sparkles, Mail, Video, Globe
} from 'lucide-react';

const ScalePromotion = ({ currency = 'GBP' }) => {
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState('3'); // 3, 6, or 12 months
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Get current month name
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  // Ad spend equivalent values per currency
  const adSpendValues = {
    GBP: '£500',
    USD: '$635',
    EUR: '€585'
  };

  // Currency symbols and rates
  const currencyData = {
    GBP: { symbol: '£', name: 'British Pound' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' }
  };

  // Scale plan pricing data with Chargebee links (from ModernShowcase)
  const scalePricing = {
    GBP: { 
      monthly: 2699, 
      deposit: 539, 
      afterKickoff: 2160,
      monthlyLink: 'https://sixtyseconds.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Onboarding-Reserve---Scale-GBP-Monthly&utm_source=cb-app-copy',
      annualLink: 'https://sixtyseconds.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Onboarding-Reserve---Scale-GBP-Yearly&utm_source=cb-app-copy'
    },
    USD: { 
      monthly: 3428, 
      deposit: 685, 
      afterKickoff: 2743,
      monthlyLink: 'https://sixtyseconds.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Onboarding-Reserve---Scale-USD-Monthly&utm_source=cb-app-copy',
      annualLink: 'https://sixtyseconds.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Onboarding-Reserve---Scale-USD-Yearly&utm_source=cb-app-copy'
    },
    EUR: { 
      monthly: 3158, 
      deposit: 631, 
      afterKickoff: 2527,
      monthlyLink: 'https://sixtyseconds.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Onboarding-Reserve---Scale-EUR-Monthly&utm_source=cb-app-copy',
      annualLink: 'https://sixtyseconds.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=Onboarding-Reserve---Scale-EUR-Yearly&utm_source=cb-app-copy'
    }
  };

  // Utility function to convert UK spelling to US spelling when USD is selected
  const convertSpelling = (text) => {
    if (currency !== 'USD') return text;
    
    const spellingMap = {
      'personalisation': 'personalization',
      'Personalisation': 'Personalization',
      'personalised': 'personalized',
      'Personalised': 'Personalized',
      'optimisation': 'optimization',
      'Optimisation': 'Optimization',
      'customisation': 'customization',
      'Customisation': 'Customization',
      'utilise': 'utilize',
      'Utilise': 'Utilize',
      'behavioural': 'behavioral',
      'Behavioural': 'Behavioral',
      'organisation': 'organization',
      'Organisation': 'Organization',
      'realise': 'realize',
      'Realise': 'Realize',
      'colour': 'color',
      'Colour': 'Color',
      'behaviour': 'behavior',
      'Behaviour': 'Behavior',
      'centre': 'center',
      'Centre': 'Center'
    };

    let result = text;
    Object.entries(spellingMap).forEach(([uk, us]) => {
      result = result.replace(new RegExp(uk, 'g'), us);
    });
    return result;
  };

  // Calculate pricing for different terms
  const calculatePricing = (months) => {
    const basePrice = scalePricing[currency];
    const totalMonths = parseInt(months);
    
    // Add validation to prevent division by zero
    if (!totalMonths || totalMonths <= 0) {
      return null;
    }
    
    const symbol = currencyData[currency].symbol;
    
    // VAT rate for UK (prices are excluding VAT, so we add it on top)
    const vatRate = currency === 'GBP' ? 0.20 : 0;
    
    // Base monthly price (excluding VAT)
    const baseMonthly = basePrice.monthly;
    
    // Month 1: 20% deposit upfront, 80% after kickoff
    const depositUpfront = basePrice.deposit; // This is already 20% of monthly
    const afterKickoff = basePrice.afterKickoff; // This is already 80% of monthly
    
    let discount = 0;
    let freeVideos = 0;
    
    if (totalMonths === 6) {
      discount = 0.10; // 10% off
      freeVideos = 1;
    } else if (totalMonths === 12) {
      discount = 0.20; // 20% off
      freeVideos = 2;
    }
    
    // Apply discount to the monthly price
    const monthlyAfterDiscount = baseMonthly * (1 - discount);
    const depositAfterDiscount = monthlyAfterDiscount * 0.20; // 20% of discounted monthly
    const afterKickoffDiscounted = monthlyAfterDiscount * 0.80; // 80% of discounted monthly
    
    // Calculate totals (excluding VAT)
    const totalExVAT = monthlyAfterDiscount * totalMonths;
    const vatAmount = totalExVAT * vatRate;
    const totalIncVAT = totalExVAT + vatAmount;
    
    // Calculate savings
    const originalTotalExVAT = baseMonthly * totalMonths;
    const savings = originalTotalExVAT - totalExVAT;
    const savingsIncVAT = savings * (1 + vatRate);
    
    return {
      // Prices excluding VAT
      monthlyExVAT: monthlyAfterDiscount,
      depositExVAT: depositAfterDiscount,
      afterKickoffExVAT: afterKickoffDiscounted,
      totalExVAT: totalExVAT,
      originalTotalExVAT: originalTotalExVAT,
      
      // Prices including VAT (for UK)
      monthlyIncVAT: monthlyAfterDiscount * (1 + vatRate),
      depositIncVAT: depositAfterDiscount * (1 + vatRate),
      afterKickoffIncVAT: afterKickoffDiscounted * (1 + vatRate),
      totalIncVAT: totalIncVAT,
      originalTotalIncVAT: originalTotalExVAT * (1 + vatRate),
      
      // VAT amounts
      vatAmount: vatAmount,
      vatRate: vatRate * 100,
      
      // Other details
      savings: savings,
      savingsIncVAT: savingsIncVAT,
      freeVideos,
      discount: discount * 100,
      symbol,
      hasVAT: currency === 'GBP',
      totalMonths
    };
  };

  const pricing = calculatePricing(selectedTerm);
  
  // Handle invalid pricing calculation
  if (!pricing) {
    return <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center text-white">
      <p>Error: Invalid pricing configuration</p>
    </div>;
  }

  // Scale plan features - exact from pricing page
  const scaleFeatures = [
    {
      category: 'Video & Email Outreach',
      items: [
        'Up to 10,000 AI Video Emails/month (after setup)',
        'Custom Landing Page with your branding',
        convertSpelling('Hyper Personalisation for each prospect'),
        'Pro AI Voice Clone technology'
      ]
    },
    {
      category: 'Data & Contacts',
      items: [
        '5,000 B2B Contacts/month',
        'Fresh, verified contact data',
        'Smart Follow-ups based on behaviour',
        'Live Stats and performance metrics'
      ]
    },
    {
      category: 'Ad Management & Media',
      items: [
        `${currency === 'USD' ? '$630' : currency === 'EUR' ? '€580' : '£500'} Paid Media Ad Spend Included/month`,
        'Multi-Channel Ad Management (up to 3 channels)',
        '4x 30 second Ad Videos included',
        'LinkedIn or Meta ads management'
      ]
    },
    {
      category: convertSpelling('Optimisation & Support'),
      items: [
        convertSpelling('Dedicated Optimisation Team'),
        convertSpelling('Weekly Optimisation sessions'),
        'Deliverability Setup & Management',
        'Priority Support (Chat, Email & Live Slack)'
      ]
    },
    {
      category: 'Integration & Management',
      items: [
        'Custom CRM Integrations (Salesforce, HubSpot, Pipedrive & Custom APIs)',
        'Managed Replies by internal team',
        'Campaign strategy and planning',
        'Performance reviews and reporting'
      ]
    }
  ];

  // Handle form input changes with sanitization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Basic input sanitization to prevent XSS
    const sanitizedValue = value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  // Handle form submission (reusing email integration from ModernShowcase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const emailSubject = `Scale Plan Interest - ${selectedTerm} Month Term`;
      const emailBody = `New Scale Plan Inquiry
      
Contact Details:
- Name: ${formData.name}
- Email: ${formData.email}
- Company: ${formData.company || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}

Selected Term: ${selectedTerm} months
Currency: ${currency}
Estimated Savings: ${pricing.symbol}${Math.round(pricing.savings).toLocaleString()}

Message:
${formData.message}

Source: Scale Promotion Page
Timestamp: ${new Date().toLocaleString()}`;

      // Method 1: Try server API first
      try {
        const recipients = [
          'leads-aaaaayhbcsc2dawosfuuiidvm4@sixtysecondsapp.slack.com',
          'andrew.bryce@sixtyseconds.video'
        ];

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipients,
            subject: emailSubject,
            body: emailBody,
            from: formData.email,
            fromName: formData.name
          })
        });

        if (response.ok) {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', company: '', phone: '', message: '' });
          return;
        }
      } catch (error) {
        console.log('Server API failed, trying fallback methods');
      }

      // Method 2: Try FormSubmit service
      try {
        const formSubmitResponse = await fetch('https://formsubmit.co/ajax/leads-aaaaayhbcsc2dawosfuuiidvm4@sixtysecondsapp.slack.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            subject: emailSubject,
            message: emailBody,
            _cc: 'andrew.bryce@sixtyseconds.video',
            _captcha: 'false',
            _template: 'basic'
          })
        });

        if (formSubmitResponse.ok) {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', company: '', phone: '', message: '' });
          return;
        }
      } catch (error) {
        console.log('FormSubmit failed, trying Netlify form');
      }

      // Method 3: Try Netlify form as final fallback
      const netlifyResponse = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'scale-promotion',
          'name': formData.name,
          'email': formData.email,
          'company': formData.company,
          'phone': formData.phone,
          'message': formData.message,
          'term': selectedTerm,
          'currency': currency
        }).toString()
      });

      if (netlifyResponse.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
      
    } catch (error) {
      console.error('All email methods failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1B] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-[400px] -left-[400px] w-[1000px] h-[1000px] bg-[#8129D7]/30 rounded-full blur-[120px] mix-blend-screen"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-[400px] -right-[400px] w-[1000px] h-[1000px] bg-[#2A5EDB]/30 rounded-full blur-[120px] mix-blend-screen"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button and Currency Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(`/${currency}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 text-white font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main
          </button>
          
          {/* Currency Toggle - moved to top right */}
          <div className="inline-flex items-center gap-2 p-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <button
              onClick={() => navigate('/UK/scale')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm ${
                currency === 'GBP' 
                  ? 'bg-[#8129D7] text-white shadow-lg shadow-[#8129D7]/30' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              🇬🇧 UK
            </button>
            <button
              onClick={() => navigate('/US/scale')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm ${
                currency === 'USD' 
                  ? 'bg-[#8129D7] text-white shadow-lg shadow-[#8129D7]/30' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              🇺🇸 US
            </button>
            <button
              onClick={() => navigate('/EU/scale')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm ${
                currency === 'EUR' 
                  ? 'bg-[#8129D7] text-white shadow-lg shadow-[#8129D7]/30' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              🇪🇺 EU
            </button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8129D7]/20 to-[#2A5EDB]/20 border border-white/10 text-sm font-medium text-white/90 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Sign up in {currentMonth} and get {adSpendValues[currency]} per month in ad spend (included after setup)
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
              Scale Your Outreach,
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#8129D7] to-[#2A5EDB] bg-clip-text text-transparent">
              Save More
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
            {convertSpelling('Get our most powerful outreach solution with exclusive discounts for longer commitments. Perfect for enterprises ready to scale their sales operations.')}
          </p>
        </motion.div>

        {/* Pricing Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              {convertSpelling('Choose Your Commitment, Maximise Your Savings')}
            </h2>
            
            {/* VAT Notice for UK */}
            {currency === 'GBP' && (
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
                  <span>All prices shown +VAT (20% will be added at checkout)</span>
                </span>
              </div>
            )}
            
            {/* Term Selection */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {[
                { months: '3', label: '3 Months', description: 'Minimum term' },
                { months: '6', label: '6 Months', description: '10% + 1 Free Video Ad', popular: true },
                { months: '12', label: '12 Months', description: '20% + 2 Free Video Ads', upfront: true }
              ].map((term) => (
                <motion.button
                  key={term.months}
                  onClick={() => setSelectedTerm(term.months)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 p-6 rounded-2xl border transition-all duration-300 relative ${
                    selectedTerm === term.months
                      ? 'bg-gradient-to-r from-[#8129D7]/20 to-[#2A5EDB]/20 border-white/30 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {term.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-white text-lg font-bold mb-2">{term.label}</div>
                  <div className="text-white/60 text-sm">{term.description}</div>
                  {term.upfront && (
                    <div className="text-cyan-400 text-xs mt-2 font-medium">Paid upfront</div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Pricing Display */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Monthly Payment Structure</h3>
                
                {selectedTerm === '12' ? (
                  // 12-month upfront payment structure
                  <div className="py-3 border-b border-white/10">
                    <div className="text-white/60 text-sm mb-2">12 Months Paid Upfront:</div>
                    <div className="space-y-2 ml-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Deposit (20% upfront)</span>
                        <span className="text-white font-mono">
                          {pricing.symbol}{Math.round(pricing.totalExVAT * 0.20).toLocaleString()}
                          {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">After kickoff call (80%)</span>
                        <span className="text-white font-mono">
                          {pricing.symbol}{Math.round(pricing.totalExVAT * 0.80).toLocaleString()}
                          {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-white font-medium">12 Months Total</span>
                        <span className="text-white font-mono font-medium">
                          {pricing.symbol}{Math.round(pricing.totalExVAT).toLocaleString()}
                          {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 3 and 6 month monthly payment structure
                  <>
                    <div className="py-3 border-b border-white/10">
                      <div className="text-white/60 text-sm mb-2">Month 1 (Setup & Onboarding):</div>
                      <div className="space-y-2 ml-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Deposit (20% upfront)</span>
                          <span className="text-white font-mono">
                            {pricing.symbol}{Math.round(pricing.depositExVAT).toLocaleString()}
                            {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">After kickoff call (80%)</span>
                          <span className="text-white font-mono">
                            {pricing.symbol}{Math.round(pricing.afterKickoffExVAT).toLocaleString()}
                            {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-white font-medium">Month 1 Total</span>
                          <span className="text-white font-mono font-medium">
                            {pricing.symbol}{Math.round(pricing.monthlyExVAT).toLocaleString()}
                            {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/80">Monthly payment (Month 2 onwards)</span>
                      <div className="text-right">
                        {pricing.discount > 0 && (
                          <div>
                            <span className="text-white/60 line-through font-mono text-sm">
                              {pricing.symbol}{scalePricing[currency].monthly.toLocaleString()}
                              {pricing.hasVAT && <span className="text-white/60 text-xs"> +VAT</span>}
                            </span>
                          </div>
                        )}
                        <span className="text-white font-mono">
                          {pricing.symbol}{Math.round(pricing.monthlyExVAT).toLocaleString()}
                          {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                {pricing.discount > 0 && (
                  <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-emerald-400 font-medium">Your Monthly Savings</span>
                        <div className="text-white/60 text-sm mt-1">{pricing.discount}% discount applied</div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-mono text-xl font-bold">
                          {pricing.symbol}{Math.round((scalePricing[currency].monthly - pricing.monthlyExVAT)).toLocaleString()}
                        </span>
                        <div className="text-emerald-400/80 text-sm">per month</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="py-4 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-white">Total over {pricing.totalMonths} months</span>
                      <div className="text-white/60 text-sm">Commitment period savings</div>
                    </div>
                    <div className="text-right">
                      {pricing.discount > 0 && (
                        <div className="text-white/60 line-through font-mono text-sm">
                          {pricing.symbol}{Math.round(pricing.originalTotalExVAT).toLocaleString()}
                          {pricing.hasVAT && <span className="text-white/60 text-xs"> +VAT</span>}
                        </div>
                      )}
                      <div className="text-xl font-bold text-white font-mono">
                        {pricing.symbol}{Math.round(pricing.totalExVAT).toLocaleString()}
                        {pricing.hasVAT && <span className="text-white/60 text-sm"> +VAT</span>}
                      </div>
                      {pricing.discount > 0 && (
                        <div className="text-emerald-400 text-sm font-medium mt-1">
                          Total saved: {pricing.symbol}{Math.round(pricing.savings).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/90">Up to 10,000 AI Video Emails/month</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/90">5,000 B2B Contacts/month</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/90">{currency === 'USD' ? '$630' : currency === 'EUR' ? '€580' : '£500'} Ad Spend/month (Early Sign-On Bonus)</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/90">{convertSpelling('Weekly Optimisation Sessions')}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/90">
                      4x 30 second Ad Videos{' '}
                      <a 
                        href="https://www.sixtyseconds.ai/video-examples/video-ads" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white underline text-sm"
                      >
                        (View Examples)
                      </a>
                    </span>
                  </div>
                  
                  {pricing.freeVideos > 0 && (
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span className="text-yellow-400 font-medium">
                        BONUS: {pricing.freeVideos} additional 30-second video{pricing.freeVideos > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center space-y-4">
              <motion.button
                onClick={() => {
                  // For 3 or 6 month terms, use monthly link; for 12 months use annual link
                  const checkoutLink = selectedTerm === '12' 
                    ? scalePricing[currency].annualLink 
                    : scalePricing[currency].monthlyLink;
                  window.open(checkoutLink, '_blank');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#8129D7] to-[#2A5EDB] hover:from-[#9747FF] hover:to-[#4C7AE6] text-white font-bold text-lg shadow-lg transition-all duration-300"
              >
                Reserve Your Spot Now
              </motion.button>
              
              <div className="mt-3">
                <a 
                  href={`/${currency === 'GBP' ? 'UK' : currency === 'USD' ? 'US' : 'EU'}/guarantee`}
                  className="text-sm text-white/60 hover:text-white/80 underline transition-colors duration-200"
                >
                  💯 Money-back guarantee*
                </a>
              </div>
              
              <div>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="text-white/60 hover:text-white underline text-sm transition-colors"
                >
                  Have questions? Contact our team
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything Included in Scale Plan
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {convertSpelling('The most comprehensive outreach solution designed for high-volume, multi-channel campaigns.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scaleFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-4">{feature.category}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Terms and Conditions Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pb-8"
        >
          <p className="text-xs text-white/40">
            * Terms and conditions apply.{' '}
            <a 
              href={`/${currency === 'GBP' ? 'UK' : currency === 'USD' ? 'US' : 'EU'}/guarantee`}
              className="text-white/50 hover:text-white/70 underline transition-colors duration-200"
            >
              View money-back guarantee details
            </a>
          </p>
        </motion.div>

        {/* Contact Modal */}
        <AnimatePresence>
          {showContactModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowContactModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Get Started with Scale Plan</h3>
                    <p className="text-white/60 text-sm mt-1">
                      {selectedTerm} month term • {pricing.symbol}{Math.round(pricing.discountedTotal).toLocaleString()} total
                      {pricing.discount > 0 && (
                        <span className="text-emerald-400 ml-2">
                          ({pricing.discount}% discount applied)
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:outline-none transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:outline-none transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:outline-none transition-colors"
                        placeholder="Your Company Ltd"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:outline-none transition-colors"
                        placeholder="+44 7XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tell us about your outreach goals *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/20 focus:outline-none transition-colors resize-none"
                      placeholder="What are your main outreach objectives? How many prospects do you plan to contact monthly?"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    {submitStatus === 'success' ? (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">
                          <Check className="w-5 h-5" />
                          Message sent successfully! We'll be in touch within 24 hours to get you started.
                        </div>
                      </div>
                    ) : submitStatus === 'error' ? (
                      <div className="text-center py-4">
                        <div className="text-red-400 font-medium mb-4">
                          Sorry, there was an error sending your message. Please try again or email us directly at andrew.bryce@sixtyseconds.video
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#8129D7] to-[#2A5EDB] hover:from-[#9747FF] hover:to-[#4C7AE6] text-white font-medium shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Sending...' : 'Try Again'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#8129D7] to-[#2A5EDB] hover:from-[#9747FF] hover:to-[#4C7AE6] text-white font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : `Get Started - ${selectedTerm} Month Plan`}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Netlify Form for fallback */}
      <form
        name="scale-promotion"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        hidden
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="company" />
        <input type="tel" name="phone" />
        <textarea name="message"></textarea>
        <input type="text" name="term" />
        <input type="text" name="currency" />
      </form>
    </div>
  );
};

export default ScalePromotion;