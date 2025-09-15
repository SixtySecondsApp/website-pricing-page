import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ModernShowcase from './components/ModernShowcase'
import ScalePromotion from './components/ScalePromotion'

/**
 * Currency-specific routes for sharing direct links to prospects:
 * 
 * Main pages (Intro page):
 * - / - Main intro page (defaults to UK)
 * - /UK - UK intro version with GBP currency and British spelling
 * - /US - US intro version with USD currency and American spelling  
 * - /EU - EU intro version with EUR currency and British spelling
 * 
 * Scale pricing pages:
 * - /UK/scale - UK Scale pricing page
 * - /US/scale - US Scale pricing page  
 * - /EU/scale - EU Scale pricing page
 * 
 * Legacy pricing pages:
 * - /legacy/UK - UK legacy pricing page
 * - /legacy/US - US legacy pricing page
 * - /legacy/EU - EU legacy pricing page
 * 
 * Solution pages:
 * - /UK/solutions/:challengeId - UK solution pages
 * - /US/solutions/:challengeId - US solution pages
 * - /EU/solutions/:challengeId - EU solution pages
 */

function App() {
  return (
    <Routes>
      {/* Main intro page - defaults to UK */}
      <Route path="/" element={<ModernShowcase key="intro-GBP" currency="GBP" />} />
      
      {/* Currency-specific intro routes */}
      <Route path="/UK" element={<ModernShowcase key="intro-GBP" currency="GBP" />} />
      <Route path="/US" element={<ModernShowcase key="intro-USD" currency="USD" />} />
      <Route path="/EU" element={<ModernShowcase key="intro-EUR" currency="EUR" />} />
      
      {/* Scale pricing routes */}
      <Route path="/UK/scale" element={<ScalePromotion key="scale-GBP" currency="GBP" />} />
      <Route path="/US/scale" element={<ScalePromotion key="scale-USD" currency="USD" />} />
      <Route path="/EU/scale" element={<ScalePromotion key="scale-EUR" currency="EUR" />} />
      <Route path="/scale" element={<Navigate to="/UK/scale" replace />} />
      
      {/* Legacy pricing routes - new structure /legacy/currency */}
      <Route path="/legacy" element={<Navigate to="/legacy/UK" replace />} />
      <Route path="/legacy/UK" element={<ModernShowcase key="legacy-GBP" currency="GBP" showPricing={true} />} />
      <Route path="/legacy/US" element={<ModernShowcase key="legacy-USD" currency="USD" showPricing={true} />} />
      <Route path="/legacy/EU" element={<ModernShowcase key="legacy-EUR" currency="EUR" showPricing={true} />} />
      
      {/* Redirect old pricing routes to Scale */}
      <Route path="/pricing" element={<Navigate to="/UK/scale" replace />} />
      <Route path="/UK/pricing" element={<Navigate to="/UK/scale" replace />} />
      <Route path="/US/pricing" element={<Navigate to="/US/scale" replace />} />
      <Route path="/EU/pricing" element={<Navigate to="/EU/scale" replace />} />
      
      {/* Solution routes */}
      <Route path="/solutions/:challengeId" element={<Navigate to="/UK/solutions/:challengeId" replace />} />
      <Route path="/UK/solutions/:challengeId" element={<ModernShowcase currency="GBP" />} />
      <Route path="/US/solutions/:challengeId" element={<ModernShowcase currency="USD" />} />
      <Route path="/EU/solutions/:challengeId" element={<ModernShowcase currency="EUR" />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App 