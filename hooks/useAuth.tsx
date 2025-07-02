"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { isTokenValid, logout } from '@/shared/utils/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState<boolean>(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasAuthenticatedRef = useRef<boolean>(false);

  const checkAuthStatus = useCallback(() => {
    const tokenIsValid = isTokenValid();
    console.log('🔐 Auth status check:', { tokenIsValid, wasAuthenticated: wasAuthenticatedRef.current });
    
    setIsLoading(false);
    
    // Token geçersizse ve önceden authenticate idiyse modal göster
    if (!tokenIsValid && wasAuthenticatedRef.current) {
      console.log('⚠️ Token became invalid - showing modal');
      setIsAuthenticated(false);
      setShowTokenExpiredModal(true);
      // wasAuthenticatedRef.current'ı false yapmıyoruz ki modal bir kez gösterilsin
      return;
    }
    
    // Token geçerliyse
    if (tokenIsValid) {
      setIsAuthenticated(true);
      setShowTokenExpiredModal(false);
      wasAuthenticatedRef.current = true;
      return;
    }
    
    // Token geçersiz ama önceden auth değilse (ilk yükleme)
    setIsAuthenticated(false);
    wasAuthenticatedRef.current = false;
  }, []);

  const handleLogout = useCallback(() => {
    console.log('🚪 Manual logout called');
    setIsAuthenticated(false);
    wasAuthenticatedRef.current = false;
    setShowTokenExpiredModal(false);
    logout();
  }, []);

  const handleTokenExpiredLoginRedirect = useCallback(() => {
    console.log('🔄 Token expired - redirecting to login');
    setShowTokenExpiredModal(false);
    setIsAuthenticated(false);
    setIsLoading(false);
    wasAuthenticatedRef.current = false;
    logout();
  }, []);

  const startPeriodicCheck = useCallback(() => {
    // Önceki interval'i temizle
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Her 10 saniyede bir kontrol et (test için daha sık)
    checkIntervalRef.current = setInterval(() => {
      console.log('⏱️ Periodic token check running...');
      checkAuthStatus();
    }, 10000); // 10 saniye
  }, [checkAuthStatus]);

  useEffect(() => {
    // İlk yüklemede auth durumunu kontrol et
    console.log('🚀 useAuth hook initialized');
    checkAuthStatus();

    // Periyodik kontrol başlat
    startPeriodicCheck();

    // Visibility change eventini dinle
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page became visible - checking auth');
        checkAuthStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      console.log('🧹 useAuth hook cleanup');
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array

  return {
    isAuthenticated,
    isLoading,
    showTokenExpiredModal,
    logout: handleLogout,
    checkAuthStatus,
    handleTokenExpiredLoginRedirect
  };
}; 