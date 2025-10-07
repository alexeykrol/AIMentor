import { useState } from 'react';

export function useModals() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPersonalQuestionsModal, setShowPersonalQuestionsModal] = useState(false);

  const openAuthModal = (mode: 'signin' | 'signup' | 'reset' = 'signin') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const openHelpModal = () => {
    setShowHelpModal(true);
  };

  const closeHelpModal = () => {
    setShowHelpModal(false);
  };

  const openPersonalQuestionsModal = () => {
    setShowPersonalQuestionsModal(true);
  };

  const closePersonalQuestionsModal = () => {
    setShowPersonalQuestionsModal(false);
  };

  return {
    // Auth Modal
    showAuthModal,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    closeAuthModal,
    
    // Help Modal
    showHelpModal,
    openHelpModal,
    closeHelpModal,
    
    // Personal Questions Modal
    showPersonalQuestionsModal,
    openPersonalQuestionsModal,
    closePersonalQuestionsModal,
  };
}