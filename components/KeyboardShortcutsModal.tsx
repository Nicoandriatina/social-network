"use client";

import { useEffect, useState } from "react";
import { X, Command, Keyboard } from "lucide-react";

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + / pour afficher les raccourcis
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // ESC pour fermer
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Ouvrir la recherche' },
    { keys: ['⌘', 'M'], description: 'Accéder aux messages' },
    { keys: ['⌘', 'U'], description: 'Accéder aux amis' },
    { keys: ['⌘', 'P'], description: 'Accéder aux projets' },
    { keys: ['⌘', '/'], description: 'Afficher les raccourcis' },
    { keys: ['ESC'], description: 'Fermer les fenêtres' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-800">Raccourcis clavier</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-slate-600">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd 
                    key={i}
                    className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {key === '⌘' ? <Command className="w-4 h-4" /> : key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Appuyez sur <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700">Ctrl /</kbd> pour afficher cette aide
          </p>
        </div>
      </div>
    </div>
  );
}