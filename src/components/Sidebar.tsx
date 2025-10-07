import React, { useState, useEffect, useRef } from 'react';
import { PanelLeftClose, PanelLeftOpen, User, Trash2, Settings, LogOut } from 'lucide-react';
import { Chat } from '../services/chats';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface SidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAccountToggle: () => void;
  user: User | null;
  onSignOut: () => void;
}

export function Sidebar({
  chats,
  selectedChatId,
  onChatSelect,
  onDeleteChat,
  collapsed,
  onToggleCollapse,
  isMobile,
  isOpen,
  onClose,
  onAccountToggle,
  user,
  onSignOut,
}: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Extract name from email (everything before @)
  const getUserName = () => {
    if (!user?.email) return 'Пользователь';
    return user.email.split('@')[0];
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);
  return (
    <div className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ${
      isMobile 
        ? `fixed left-0 top-0 h-full z-50 w-80 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        : collapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {(!collapsed || isMobile) && (
              <h2 className="text-xs font-normal text-gray-900">История чатов</h2>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {(collapsed && !isMobile) ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Chat List */}
        {(!collapsed || isMobile) && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-0">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-lg transition-colors ${
                    selectedChatId === chat.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => onChatSelect(chat.id)}
                    className="w-full text-left p-3 pr-10"
                  >
                    <div className="truncate text-xs font-normal text-gray-900 mb-1">
                      {chat.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(chat.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    title="Удалить чат"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {chats.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Нет сохраненных чатов
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spacer for collapsed state */}
        {collapsed && !isMobile && (
          <div className="flex-1"></div>
        )}

        {/* User Menu */}
        {user && (
          <div className="p-4 border-t border-gray-200 relative" ref={menuRef}>
            {collapsed && !isMobile ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors mx-auto"
                title={getUserName()}
              >
                <User className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-normal text-gray-900">{getUserName()}</div>
                </div>
              </button>
            )}
            
            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className={`absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 ${
                collapsed && !isMobile ? 'left-0 w-48' : 'left-4 right-4'
              }`}>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onAccountToggle();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Настройки</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSignOut();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Выход</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}