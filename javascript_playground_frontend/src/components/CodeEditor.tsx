'use client';

import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: 'light' | 'dark';
}

// PUBLIC_INTERFACE
export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  theme,
}) => {
  const editorRef = useRef<unknown>(null);

  const handleEditorDidMount = (editor: unknown, monaco: unknown) => {
    editorRef.current = editor;

    // Configure editor options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).updateOptions({
      fontSize: 14,
      fontFamily: 'var(--font-geist-mono), "Fira Code", "Cascadia Code", Monaco, Menlo, "Ubuntu Mono", monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      minimap: { enabled: false },
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'selection',
      renderLineHighlight: 'line',
      selectionHighlight: 'off',
      occurrencesHighlight: 'off',
      renderValidationDecorations: 'on',
    });

    // Set up keyboard shortcuts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).addCommand(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (monaco as any).KeyMod.CtrlCmd | 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (monaco as any).KeyCode.Enter, 
      () => {
        // Run code shortcut - handled by parent component
        const event = new CustomEvent('runCode');
        window.dispatchEvent(event);
      }
    );

    // Focus the editor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).focus();
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className="h-full bg-[var(--editor-bg)]">
      <div className="border-b border-[var(--border)] px-4 py-2 bg-background">
        <h2 className="text-sm font-medium text-foreground">
          JavaScript Editor
        </h2>
      </div>
      <div className="h-[calc(100%-49px)]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: 14,
            fontFamily: 'var(--font-geist-mono), "Fira Code", "Cascadia Code", Monaco, Menlo, "Ubuntu Mono", monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            renderLineHighlight: 'line',
            selectionHighlight: false,
            occurrencesHighlight: 'off',
            renderValidationDecorations: 'on',
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            acceptSuggestionOnCommitCharacter: true,
            snippetSuggestions: 'top',
            quickSuggestions: true,
            contextmenu: true,
            dragAndDrop: true,
            formatOnPaste: true,
            formatOnType: false,
          }}
        />
      </div>
    </div>
  );
};
