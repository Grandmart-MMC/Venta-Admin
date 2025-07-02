"use client";
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner/Spinner';
import TokenExpiredModal from './TokenExpiredModal';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { 
    isAuthenticated, 
    isLoading, 
    showTokenExpiredModal, 
    checkAuthStatus, 
    handleTokenExpiredLoginRedirect 
  } = useAuth();

  // Cookie değişikliklerini dinle (manuel token silme için)
  useEffect(() => {
    const checkCookieChanges = () => {
      console.log('🍪 Cookie change detected - checking auth status');
      checkAuthStatus();
    };

    // Storage event dinleme (başka tab'dan değişiklik için)
    window.addEventListener('storage', checkCookieChanges);
    
    // Focus event dinleme (tab değişiminde)
    window.addEventListener('focus', checkCookieChanges);

    return () => {
      window.removeEventListener('storage', checkCookieChanges);
      window.removeEventListener('focus', checkCookieChanges);
    };
  }, [checkAuthStatus]);

  if (isLoading) {
    console.log('🔄 AuthWrapper: Loading...');
    return <Spinner />;
  }

  // Token expired modal açıksa, children'ı göster ama modal da göster
  if (showTokenExpiredModal) {
    console.log('🔔 AuthWrapper: Showing token expired modal');
    return (
      <>
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        <TokenExpiredModal 
          isOpen={showTokenExpiredModal}
          onLoginRedirect={handleTokenExpiredLoginRedirect}
        />
      </>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ AuthWrapper: Not authenticated - should redirect');
    // useAuth hook'u otomatik olarak login sayfasına yönlendirecek
    return <Spinner />;
  }

  console.log('✅ AuthWrapper: Authenticated - showing children');
  return <>{children}</>;
};

export default AuthWrapper; 