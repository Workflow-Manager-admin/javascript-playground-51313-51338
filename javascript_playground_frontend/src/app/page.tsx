'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { OutputPanel } from '@/components/OutputPanel';
import { SnippetManager } from '@/components/SnippetManager';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SharedCodeHandler } from '@/components/SharedCodeHandler';

// PUBLIC_INTERFACE
export default function JavaScriptPlayground() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useLocalStorage('playground-code', '// Welcome to JavaScript Playground!\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSnippets, setShowSnippets] = useState<boolean>(false);

  // Execute JavaScript code safely
  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      setOutput('// No code to execute');
      setErrors([]);
      return;
    }

    setIsRunning(true);
    setErrors([]);
    setOutput('');

    try {
      // Create a safe execution environment
      const logs: string[] = [];

      // Override console methods to capture output
      const mockConsole = {
        log: (...args: unknown[]) => {
          logs.push(`[LOG] ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')}`);
        },
        error: (...args: unknown[]) => {
          logs.push(`[ERROR] ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')}`);
        },
        warn: (...args: unknown[]) => {
          logs.push(`[WARN] ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')}`);
        },
        info: (...args: unknown[]) => {
          logs.push(`[INFO] ${args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')}`);
        },
      };

      // Create a safe execution function
      const executeUserCode = new Function('console', code);
      
      // Execute the code
      const result = executeUserCode(mockConsole);
      
      // If there's a return value, add it to output
      if (result !== undefined) {
        logs.push(`[RETURN] ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
      }

      setOutput(logs.join('\n') || '// Code executed successfully (no output)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrors([errorMessage]);
      setOutput(`// Execution failed\n[ERROR] ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  // Auto-run code when it changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.trim()) {
        executeCode();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [code, executeCode]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSnippets(true);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [executeCode]);

  return (
    <>
      <SharedCodeHandler />
      <div className="flex flex-col h-screen bg-background text-foreground" data-theme={theme}>
      <Header 
        theme={theme}
        onThemeToggle={toggleTheme}
        onRunCode={executeCode}
        onSaveSnippet={() => setShowSnippets(true)}
        isRunning={isRunning}
      />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Code Editor Panel */}
        <div className="flex-1 min-w-0">
          <CodeEditor
            value={code}
            onChange={setCode}
            theme={theme}
          />
        </div>

        {/* Output Panel */}
        <div className="flex-1 min-w-0">
          <OutputPanel
            output={output}
            errors={errors}
            isRunning={isRunning}
          />
        </div>
      </main>

      {/* Snippet Manager Modal */}
      {showSnippets && (
        <SnippetManager
          currentCode={code}
          onLoadSnippet={setCode}
          onClose={() => setShowSnippets(false)}
        />
      )}
      </div>
    </>
  );
}
