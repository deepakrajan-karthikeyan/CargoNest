// Shared client-side helpers for CargoNest.
document.addEventListener('submit', function (event) {
  const form = event.target;
  if (form.dataset.confirm && !window.confirm(form.dataset.confirm)) event.preventDefault();
});

let deferredInstallPrompt;
const installHelp = document.getElementById('pwa-install-help');
const installButton = document.getElementById('pwa-install-button');
const installMessage = document.getElementById('pwa-install-message');
const installClose = document.getElementById('pwa-install-close');

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

if (installHelp && !isStandalone()) {
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
    installMessage.textContent = 'Add CargoNest to your home screen for a full-screen app experience.';
    installHelp.hidden = false;
  });

  if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
    installHelp.hidden = false;
    installMessage.textContent = 'Tap Share, then choose “Add to Home Screen” to install CargoNest.';
  }

  installButton.addEventListener('click', async function () {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installHelp.hidden = true;
  });
  installClose.addEventListener('click', function () {
    installHelp.hidden = true;
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').catch(function (error) {
      console.error('CargoNest service worker registration failed:', error);
    });
  });
}
