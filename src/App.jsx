import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ModernShowcase from './components/ModernShowcase'
import ScalePromotion from './components/ScalePromotion'

/**
 * Currency-specific routes for sharing direct links to prospects:
 * 
 * Main pages:
 * - /UK - UK version with GBP currency and British spelling
 * - /US - US version with USD currency and American spelling  
 * - /EU - EU version with EUR currency and British spelling
 * 
 * Pricing pages:
 * - /UK/pricing - UK pricing page
 * - /US/pricing - US pricing page  
 * - /EU/pricing - EU pricing page
 * 
 * Scale promotion pages:
 * - /UK/scale - UK Scale plan promotion page
 * - /US/scale - US Scale plan promotion page
 * - /EU/scale - EU Scale plan promotion page
 * 
 * Solution pages:
 * - /UK/solutions/:challengeId - UK solution pages
 * - /US/solutions/:challengeId - US solution pages
 * - /EU/solutions/:challengeId - EU solution pages
 */

function App() {
  return (
    <Routes>
      <Route path="/" element={<ModernShowcase />} />
      <Route path="/solutions/:challengeId" element={<ModernShowcase />} />
      <Route path="/pricing" element={<ModernShowcase />} />
      
      {/* Currency-specific routes */}
      <Route path="/UK" element={<ModernShowcase currency="GBP" />} />
      <Route path="/US" element={<ModernShowcase currency="USD" />} />
      <Route path="/EU" element={<ModernShowcase currency="EUR" />} />
      
      {/* Currency-specific pricing routes */}
      <Route path="/UK/pricing" element={<ModernShowcase currency="GBP" showPricing={true} />} />
      <Route path="/US/pricing" element={<ModernShowcase currency="USD" showPricing={true} />} />
      <Route path="/EU/pricing" element={<ModernShowcase currency="EUR" showPricing={true} />} />
      
      {/* Currency-specific Scale promotion routes */}
      <Route path="/UK/scale" element={<ScalePromotion currency="GBP" />} />
      <Route path="/US/scale" element={<ScalePromotion currency="USD" />} />
      <Route path="/EU/scale" element={<ScalePromotion currency="EUR" />} />
      
      {/* Currency-specific solution routes */}
      <Route path="/UK/solutions/:challengeId" element={<ModernShowcase currency="GBP" />} />
      <Route path="/US/solutions/:challengeId" element={<ModernShowcase currency="USD" />} />
      <Route path="/EU/solutions/:challengeId" element={<ModernShowcase currency="EUR" />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App 