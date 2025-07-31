'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, AlertCircle, CheckCircle } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  errors: string[];
  isRunning: boolean;
}

// PUBLIC_INTERFACE
export const OutputPanel: React.FC<OutputPanelProps> = ({ output, errors, isRunning }) => {
    const outputRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new output appears
    useEffect(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, [output, errors]);

    const formatOutput = (output: string) => {
      if (!output) return null;

      return output.split('\n').map((line, index) => {
        let className = 'console-log';
        let icon = null;

        if (line.startsWith('[ERROR]')) {
          className += ' error';
          icon = <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />;
        } else if (line.startsWith('[WARN]')) {
          className += ' warn';
        } else if (line.startsWith('[INFO]')) {
          className += ' info';
        } else if (line.startsWith('[LOG]')) {
          className += ' log';
        } else if (line.startsWith('[RETURN]')) {
          className += ' log';
          icon = <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />;
        } else {
          className += ' log';
        }

        // Remove the prefix for display
        const displayLine = line.replace(/^\[(?:LOG|ERROR|WARN|INFO|RETURN)\]\s?/, '');

        return (
          <div key={index} className={className}>
            <div className="flex items-start">
              {icon}
              <span className="flex-1">{displayLine}</span>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="h-full bg-[var(--output-bg)] output-panel">
        <div className="border-b border-[var(--border)] px-4 py-2 bg-background flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <h2 className="text-sm font-medium text-foreground">Output</h2>
          </div>
          <div className="flex items-center space-x-2">
            {isRunning && (
              <div className="flex items-center space-x-2 text-xs text-foreground/70">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span>Running...</span>
              </div>
            )}
            {!isRunning && errors.length === 0 && output && (
              <div className="flex items-center space-x-1 text-xs text-green-500">
                <CheckCircle className="w-3 h-3" />
                <span>Success</span>
              </div>
            )}
            {errors.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.length} error{errors.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div 
          ref={outputRef}
          className="h-[calc(100%-49px)] overflow-auto p-4 console-output"
        >
          {isRunning && (
            <div className="flex items-center space-x-2 text-foreground/70 mb-4">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span>Executing code...</span>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-4">
              {errors.map((error, index) => (
                <div key={index} className="error-message">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="flex-1">{error}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {output && (
            <div className="console-output">
              {formatOutput(output)}
            </div>
          )}

          {!output && !isRunning && errors.length === 0 && (
            <div className="text-foreground/50 text-center py-8">
              <Terminal className="w-8 h-8 mx-auto mb-4 opacity-50" />
              <p>Write some JavaScript code and see the output here.</p>
              <p className="text-sm mt-2">
                Press <kbd className="px-1 py-0.5 bg-secondary text-xs rounded">Ctrl+Enter</kbd> to run your code.
              </p>
            </div>
          )}
        </div>
      </div>
    );
};
