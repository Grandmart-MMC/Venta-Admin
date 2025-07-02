// Token'ı cookie'den al
export const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const authTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("auth-token=")
  );

  if (authTokenCookie) {
    return authTokenCookie.split("=")[1];
  }

  return null;
};

// Token'ı decode et (JWT token için)
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Token'ın süresinin bitip bitmediğini kontrol et
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      console.log('🔒 Token decoded failed or no expiry found');
      return true;
    }
    
    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;
    
    console.log('🕐 Token time check:', {
      expiresAt: new Date(decoded.exp * 1000).toLocaleString(),
      currentTime: new Date().toLocaleString(),
      timeLeftMinutes: Math.floor(timeLeft / 60),
      isExpired: decoded.exp < currentTime
    });
    
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Token expiry check error:', error);
    return true;
  }
};

// Token'ın geçerli olup olmadığını kontrol et
export const isTokenValid = (): boolean => {
  const token = getTokenFromCookie();
  if (!token) {
    return false;
  }
  
  return !isTokenExpired(token);
};

// Token'ı sil ve logout yap
export const logout = () => {
  console.log('🚪 Logout triggered - clearing token and redirecting');
  
  // Token'ı sil
  document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Login sayfasına yönlendir
  const currentPath = window.location.pathname;
  const locale = currentPath.split('/')[1]; // /en, /az, /ru
  
  console.log('🌍 Redirect info:', { currentPath, locale });
  
  // Eğer şu anda login sayfasında değilse yönlendir
  if (!currentPath.includes('/login') && currentPath !== `/${locale}` && currentPath !== '/') {
    console.log('🔄 Redirecting to login page');
    window.location.href = `/${locale || 'en'}`;
  }
};

// Token'ın süresini düzenli olarak kontrol et
export const startTokenExpiryCheck = (intervalMs: number = 60000) => {
  console.log(`⏰ Starting token expiry check every ${intervalMs/1000} seconds`);
  
  const checkInterval = setInterval(() => {
    console.log('⏱️ Periodic token check running...');
    if (!isTokenValid()) {
      console.log('❌ Token expired during periodic check - logging out');
      clearInterval(checkInterval);
      logout();
    }
  }, intervalMs);
  
  return checkInterval;
}; 