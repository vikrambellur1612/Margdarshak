// Service Worker Registration and PWA functionality for Margdarshak FAQ

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('ServiceWorker registered:', registration.scope);
        
        // Check for updates every 60 seconds
        setInterval(() => registration.update(), 60000);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                this.showUpdateNotification();
              }
            }
          });
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            this.showCacheUpdateNotification();
          }
        });
        
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }

    // Set up install prompt handling
    this.setupInstallPrompt();
    
    // Check if app is already installed
    this.checkInstallStatus();
    
    // Handle app shortcuts
    this.handleAppShortcuts();
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt available');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed successfully');
      this.isInstalled = true;
      this.hideInstallBanner();
      this.showInstallSuccessMessage();
      this.deferredPrompt = null;
    });
  }

  showInstallBanner() {
    // Create install banner if it doesn't exist
    if (document.getElementById('pwa-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="install-banner-content">
        <div class="install-banner-text">
                    <strong>📱 Install Margdarshak FAQ</strong>
          <p>Add to your home screen for quick access!</p>
        </div>
        <div class="install-banner-actions">
          <button id="pwa-install-btn" class="install-btn">Install</button>
          <button id="pwa-dismiss-btn" class="dismiss-btn">×</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #2c5aa0, #1e3a8a);
        color: white;
        padding: 12px 16px;
        z-index: 2000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
      }
      
      .install-banner-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        gap: 15px;
      }
      
      .install-banner-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .install-banner-text strong {
        font-size: 1rem;
      }
      
      .install-banner-text span {
        font-size: 0.85rem;
        opacity: 0.9;
      }
      
      .install-banner-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .install-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        white-space: nowrap;
      }
      
      .install-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }
      
      .dismiss-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.3s ease;
      }
      
      .dismiss-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
      
      @media (max-width: 768px) {
        .install-banner-content {
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }
        
        .install-banner-text {
          order: 1;
        }
        
        .install-banner-actions {
          order: 2;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      this.promptInstall();
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      this.hideInstallBanner();
      // Remember user dismissed the banner
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    });

    // Auto-hide after 10 seconds if user doesn't interact
    setTimeout(() => {
      if (document.getElementById('pwa-install-banner')) {
        this.hideInstallBanner();
      }
    }, 10000);
  }

  async promptInstall() {
    if (!this.deferredPrompt) return;

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`Install prompt result: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      this.deferredPrompt = null;
      this.hideInstallBanner();
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  }

  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => banner.remove(), 300);
    }
  }

  showInstallSuccessMessage() {
    this.showToast('🎉 Margdarshak FAQ installed successfully!', 'success', 5000);
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span>📱 New version available!</span>
        <div class="update-actions">
          <button id="update-now-btn">Update Now</button>
          <button id="update-later-btn">Later</button>
        </div>
      </div>
    `;

    // Add styles for update notification
    if (!document.getElementById('update-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'update-notification-styles';
      style.textContent = `
        .update-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #2c5aa0;
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          z-index: 2000;
          animation: slideInUp 0.3s ease;
        }
        
        .update-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        
        .update-actions {
          display: flex;
          gap: 8px;
        }
        
        .update-actions button {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
        }
        
        #update-now-btn {
          background: white;
          color: #2c5aa0;
        }
        
        #update-now-btn:hover {
          background: #f0f0f0;
        }
        
        #update-later-btn {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        
        #update-later-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        
        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .update-notification {
            bottom: 10px;
            right: 10px;
            left: 10px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Handle update actions
    document.getElementById('update-now-btn').addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('update-later-btn').addEventListener('click', () => {
      notification.remove();
    });

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 8000);
  }

  checkInstallStatus() {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('App is running as installed PWA');
      
      // Add PWA-specific styles
      document.body.classList.add('pwa-installed');
    }
  }

  handleAppShortcuts() {
    // Handle URL parameters for app shortcuts
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    if (page) {
      // Handle shortcut navigation
      setTimeout(() => {
        switch (page) {
          case 'jee':
            this.navigateToDocument('documents/Margdarshak FAQ - JEE.html');
            break;
          case 'kcet':
            this.navigateToDocument('documents/Margdarshak FAQ - KCET.html');
            break;
          case 'medical':
            this.navigateToDocument('documents/Medical.html');
            break;
          case 'science':
            this.navigateToDocument('documents/Science and Mathematics.html');
            break;
        }
      }, 1000);
    }
  }

  navigateToDocument(filePath) {
    if (typeof loadDocument === 'function') {
      loadDocument(filePath);
    } else {
      // Fallback navigation
      window.location.href = filePath;
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add toast styles if not already present
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 2001;
          animation: toastSlideIn 0.3s ease;
          max-width: 90%;
          text-align: center;
        }
        
        .toast-success {
          background: #10b981;
        }
        
        .toast-error {
          background: #ef4444;
        }
        
        .toast-warning {
          background: #f59e0b;
        }
        
        @keyframes toastSlideIn {
          from { transform: translateX(-50%) translateY(100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes toastSlideOut {
          from { transform: translateX(-50%) translateY(0); opacity: 1; }
          to { transform: translateX(-50%) translateY(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto-remove toast
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Network status detection
  setupNetworkDetection() {
    let isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      if (!isOnline) {
        isOnline = true;
        this.showToast('🌐 Back online!', 'success');
      }
    });

    window.addEventListener('offline', () => {
      if (isOnline) {
        isOnline = false;
        this.showToast('📴 You\'re offline - cached content available', 'warning', 5000);
      }
    });
  }
}

// Initialize PWA functionality when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
  });
} else {
  window.pwaManager = new PWAManager();
}
