'use client';

import React from 'react';
import { Play, Save, Sun, Moon, Share2, Download, Upload } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onRunCode: () => void;
  onSaveSnippet: () => void;
  isRunning: boolean;
}

// PUBLIC_INTERFACE
export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeToggle,
  onRunCode,
  onSaveSnippet,
  isRunning,
}) => {
  const handleExportCode = () => {
    const code = localStorage.getItem('playground-code') || '';
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.javascript,.txt';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          localStorage.setItem('playground-code', content);
          window.location.reload(); // Simple way to update the editor
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleShare = async () => {
    const code = localStorage.getItem('playground-code') || '';
    const encoded = btoa(encodeURIComponent(code));
    const shareUrl = `${window.location.origin}?code=${encoded}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'JavaScript Playground Code',
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Share URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Share URL copied to clipboard!');
    }
  };

  return (
    <header className="bg-background border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-foreground">
          JavaScript Playground
        </h1>
        <div className="hidden sm:flex items-center space-x-2 text-sm text-foreground/70">
          <span>Press</span>
          <kbd className="px-2 py-1 bg-secondary text-xs rounded border border-[var(--border)]">
            Ctrl+Enter
          </kbd>
          <span>to run</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-primary font-medium rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Run Code (Ctrl+Enter)"
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isRunning ? 'Running...' : 'Run'}
          </span>
        </button>

        <button
          onClick={onSaveSnippet}
          className="flex items-center space-x-2 px-3 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
          title="Save Snippet (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-3 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
          title="Share Code"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleImportCode}
            className="p-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
            title="Import Code"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCode}
            className="p-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
            title="Export Code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onThemeToggle}
          className="p-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
