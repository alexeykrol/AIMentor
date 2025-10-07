import React from 'react';
import { MessageCircle, Plus, PanelLeftOpen, HelpCircle } from 'lucide-react';
import { APP_TEXTS } from './config/texts';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useChats } from './hooks/useChats';
import { usePersonalization } from './hooks/usePersonalization';
import { useModals } from './hooks/useModals';
import { ChatInterface } from './components/ChatInterface';
import { ErrorNotification } from './components/ErrorNotification';
import { Sidebar } from './components/Sidebar';
import { ProgressBar } from './components/ProgressBar';
import { UserMenu } from './components/UserMenu';
import { AuthModal } from './components/AuthModal';
import { HelpModal } from './components/HelpModal';
import { PersonalQuestionsModal } from './components/PersonalQuestionsModal';
import { AdminPanel } from './adminpan/AdminPanel';
import { AccountPanel } from './account/AccountPanel';



function App() {
  const {
    user,
    loading: authLoading,
    error: authError,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError: clearAuthError
  } = useAuth();

  const { chats, selectedChatId, setSelectedChatId, deleteChat: deleteChatFromHook, refreshChats } = useChats();
  const {
    totalQuestionCount,
    personalQuestionMode,
    targetQuestions,
    analysisCompleted,
    togglePersonalMode,
    getPersonalModeProgress,
    incrementQuestionCount,
  } = usePersonalization();
  const {
    showAuthModal,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    closeAuthModal,
    showHelpModal,
    openHelpModal,
    closeHelpModal,
    showPersonalQuestionsModal,
    openPersonalQuestionsModal,
    closePersonalQuestionsModal,
  } = useModals();

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);
  const [showAccountPanel, setShowAccountPanel] = React.useState(false);
  const [prefilledQuestion, setPrefilledQuestion] = React.useState<string>('');

  const {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  } = useChat(selectedChatId || undefined, refreshChats);

  // Check for mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Handle message sending with auth check
  const handleSendMessage = (message: string) => {
    // Require authentication for all messages
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    sendMessage(message);
    
    // Increment question count and check for analysis completion
    const analysisCompleted = incrementQuestionCount();
    if (analysisCompleted) {
      clearChat();
    }
  };

  const handlePrefilledQuestion = (question: string) => {
    setPrefilledQuestion(question);
  };

  // Clear prefilled question
  const handleClearPrefilled = () => {
    setPrefilledQuestion('');
  };


  // Handle admin panel toggle
  const handleAdminToggle = () => {
    setShowAdminPanel(!showAdminPanel);
  };

  // Handle account panel toggle
  const handleAccountToggle = () => {
    setShowAccountPanel(!showAccountPanel);
  };

  // Handle auth modal submission
  const handleAuthModalSubmit = async (email: string, password: string) => {
    let result;
    if (authModalMode === 'signin') {
      result = await signIn(email, password);
    } else if (authModalMode === 'signup') {
      result = await signUp(email, password);
    } else if (authModalMode === 'reset') {
      result = await resetPassword(email);
    }
    
    if (result?.success) {
      closeAuthModal();
      refreshChats(); // Refresh chats after successful auth
    }
  };

  // If admin panel is open, show it instead of main interface
  if (showAdminPanel) {
    return <AdminPanel onClose={() => setShowAdminPanel(false)} />;
  }

  // If account panel is open, show it instead of main interface
  if (showAccountPanel) {
    return <AccountPanel onClose={() => setShowAccountPanel(false)} />;
  }

  // Show loading screen during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onChatSelect={setSelectedChatId}
        onDeleteChat={deleteChatFromHook}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAccountToggle={handleAccountToggle}
        user={user}
        onSignOut={signOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 w-full">
          <div className="px-2 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center py-2 sm:py-4">
              <div className="flex items-center min-w-0">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-2 sm:mr-3 flex-shrink-0"
                  >
                    <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">{APP_TEXTS.APP_TITLE}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">{APP_TEXTS.APP_SUBTITLE}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
                <button
                  className="inline-flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  onClick={handleAdminToggle}
                >
                  Admin
                </button>
{isAuthenticated ? (
                  <button
                    className="inline-flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={() => {
                      clearChat();
                      setSelectedChatId(null);
                    }}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {APP_TEXTS.BUTTON_NEW_CHAT}
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    onClick={() => openAuthModal()}
                  >
                    Войти
                  </button>
                )}
                <button
                  onClick={openHelpModal}
                  className="inline-flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  title="Помощь"
                >
                  <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Block */}
        {!personalQuestionMode && totalQuestionCount < 10 && (
          <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0 w-full">
            <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 lg:p-4">
                <p className="text-xs sm:text-sm text-blue-800 text-center leading-relaxed">
                  {APP_TEXTS.HOW_IT_WORKS}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Personal Question Mode Progress Bar */}
        {personalQuestionMode && totalQuestionCount < 10 && (
          <ProgressBar
            totalQuestions={totalQuestionCount}
            targetQuestions={targetQuestions}
            message={getPersonalModeProgress().message}
          />
        )}

        {/* Analysis Completed Message */}

        {/* Chat Content */}
        <div className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-4 min-h-0 overflow-hidden">
          <div className="h-full">
            <ChatInterface
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              totalQuestions={totalQuestionCount}
              prefilledQuestion={prefilledQuestion}
              onClearPrefilled={handleClearPrefilled}
              onPrefilledQuestion={handlePrefilledQuestion}
              onTogglePersonalMode={togglePersonalMode}
              personalQuestionMode={personalQuestionMode}
              userAnalyzed={analysisCompleted}
              onViewPersonalQuestions={openPersonalQuestionsModal}
            />
          </div>
        </div>
      </div>
      
      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={closeHelpModal}
      />
      
      {/* Personal Questions Modal */}
      <PersonalQuestionsModal
        isOpen={showPersonalQuestionsModal}
        onClose={closePersonalQuestionsModal}
        onAskQuestion={handlePrefilledQuestion}
        onFocusInput={() => {
          setTimeout(() => {
            const inputElement = document.querySelector('textarea[placeholder*="Напишите ваш вопрос"]') as HTMLTextAreaElement;
            if (inputElement) {
              inputElement.focus();
            }
          }, 100);
        }}
      />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        mode={authModalMode}
        loading={authLoading}
        onClose={closeAuthModal}
        onSubmit={handleAuthModalSubmit}
        onModeChange={setAuthModalMode}
      />
      
      {/* Error Notification */}
      {authError && (
        <ErrorNotification
          message={authError}
          onClose={clearAuthError}
        />
      )}
    </div>
  );
}

export default App;