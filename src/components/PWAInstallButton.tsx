import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Check, X, Smartphone, Share } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'drawer' | 'hero';
  activeThemeBtnClass?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  activeThemeBtnClass = 'bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (installed) {
        setJustInstalled(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback modal or notice for browsers without beforeinstallprompt trigger
      setShowIOSGuide(true);
    }
  };

  if (isInstalled || justInstalled) {
    if (variant === 'header') return null;
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <Check size={14} />
        <span>অ্যাপ ইনস্টলড</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`font-sans font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
          variant === 'header'
            ? `px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl ${activeThemeBtnClass}`
            : variant === 'drawer'
            ? `w-full py-3.5 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs`
            : `px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg hover:scale-105 active:scale-95`
        }`}
        title="স্মার্টফোনে বা কম্পিউটারে অ্যাপ হিসেব ইন্সটল করুন"
        aria-label="Install App"
      >
        <img src="/favicon.svg" alt="App Logo" className="w-4 h-4 rounded-xs shrink-0" />
        <Download size={15} className="shrink-0" />
        <span>অ্যাপ ইনস্টল করুন</span>
      </button>

      {/* iOS & Browser Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-amber-500/30 p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-full opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-amber-500/40 p-2 flex items-center justify-center shrink-0">
                <img src="/icon.svg" alt="App Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-300">হোম স্ক্রিনে অ্যাপ ইনস্টল</h3>
                <p className="text-xs opacity-75">Saiful Islam Rifat · Vision & Roadmap</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 my-4 text-xs opacity-90 leading-relaxed bg-zinc-800/80 p-4 rounded-xl border border-zinc-700/60">
                <div className="flex items-start gap-2.5">
                  <Share size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>১. সাফারি (Safari) ব্রাউজারের নিচে <strong>শেয়ার (Share)</strong> বাটনে ক্লিক করুন।</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Smartphone size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>২. একটু নিচে স্ক্রোল করে <strong>"Add to Home Screen" (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন।</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 my-4 text-xs opacity-90 leading-relaxed bg-zinc-800/80 p-4 rounded-xl border border-zinc-700/60">
                <div className="flex items-start gap-2.5">
                  <Download size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>ব্রাউজারের অ্যাড্রেস বারের ডান পাশে থাকা <strong>"Install" (ইন্সটল)</strong> আইকনে ক্লিক করুন অথবা থ্রি-ডট (⋮) মেনু থেকে <strong>"Install App / Add to Home Screen"</strong> বেছে নিন।</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full mt-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
