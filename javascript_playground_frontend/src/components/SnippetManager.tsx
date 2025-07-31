'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Copy, Download, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Snippet {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface SnippetManagerProps {
  currentCode: string;
  onLoadSnippet: (code: string) => void;
  onClose: () => void;
}

// PUBLIC_INTERFACE
export const SnippetManager: React.FC<SnippetManagerProps> = ({
  currentCode,
  onLoadSnippet,
  onClose,
}) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetName, setSnippetName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load snippets from localStorage on mount
  useEffect(() => {
    const savedSnippets = localStorage.getItem('playground-snippets');
    if (savedSnippets) {
      try {
        const parsed = JSON.parse(savedSnippets);
        setSnippets(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Failed to parse saved snippets:', error);
        setSnippets([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Save snippets to localStorage whenever snippets change
  const saveSnippetsToStorage = (newSnippets: Snippet[]) => {
    localStorage.setItem('playground-snippets', JSON.stringify(newSnippets));
    setSnippets(newSnippets);
  };

  const handleSaveSnippet = () => {
    if (!snippetName.trim() || !currentCode.trim()) {
      alert('Please provide both a name and code for the snippet.');
      return;
    }

    const newSnippet: Snippet = {
      id: uuidv4(),
      name: snippetName.trim(),
      code: currentCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedSnippets = [newSnippet, ...snippets];
    saveSnippetsToStorage(updatedSnippets);
    setSnippetName('');
    alert('Snippet saved successfully!');
  };

  const handleLoadSnippet = (snippet: Snippet) => {
    onLoadSnippet(snippet.code);
    onClose();
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      const updatedSnippets = snippets.filter(s => s.id !== snippetId);
      saveSnippetsToStorage(updatedSnippets);
    }
  };

  const handleCopySnippet = async (snippet: Snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      alert('Snippet copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy snippet:', error);
      alert('Failed to copy snippet to clipboard.');
    }
  };

  const handleExportSnippet = (snippet: Snippet) => {
    const blob = new Blob([snippet.code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-[var(--border)] rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Snippet Manager</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(80vh-73px)]">
          {/* Save New Snippet Panel */}
          <div className="w-1/3 border-r border-[var(--border)] p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground">Save Current Code</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Snippet name..."
                value={snippetName}
                onChange={(e) => setSnippetName(e.target.value)}
                className="w-full px-3 py-2 bg-secondary text-foreground border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveSnippet()}
              />
              <button
                onClick={handleSaveSnippet}
                disabled={!snippetName.trim() || !currentCode.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-primary font-medium rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Snippet</span>
              </button>
              <div className="text-xs text-foreground/70">
                <p>Current code preview:</p>
                <pre className="mt-2 p-2 bg-secondary rounded text-xs overflow-hidden">
                  {currentCode.slice(0, 200)}
                  {currentCode.length > 200 && '...'}
                </pre>
              </div>
            </div>
          </div>

          {/* Saved Snippets List */}
          <div className="flex-1 p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground">
              Saved Snippets ({snippets.length})
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8 text-foreground/70">
                Loading snippets...
              </div>
            ) : snippets.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Save className="w-8 h-8 mx-auto mb-4 opacity-50" />
                <p>No snippets saved yet.</p>
                <p className="text-sm mt-2">Save your first snippet to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-full">
                {snippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="p-4 bg-secondary rounded-lg border border-[var(--border)] hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground truncate flex-1 mr-4">
                        {snippet.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleLoadSnippet(snippet)}
                          className="p-1 hover:bg-background rounded transition-colors"
                          title="Load snippet"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopySnippet(snippet)}
                          className="p-1 hover:bg-background rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExportSnippet(snippet)}
                          className="p-1 hover:bg-background rounded transition-colors"
                          title="Export as file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                          title="Delete snippet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-foreground/70 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Created: {formatDate(snippet.createdAt)}</span>
                    </div>
                    
                    <pre className="text-xs bg-background p-2 rounded overflow-hidden text-foreground/80">
                      {snippet.code.slice(0, 150)}
                      {snippet.code.length > 150 && '...'}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
