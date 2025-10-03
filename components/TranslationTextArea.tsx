
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, ClearIcon } from './Icons';

interface TranslationTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  value: string;
  isReadOnly: boolean;
  isLoading?: boolean;
  lang: string;
  onClear?: () => void;
}

export const TranslationTextArea: React.FC<TranslationTextAreaProps> = ({
  id,
  value,
  isReadOnly,
  isLoading = false,
  lang,
  onClear,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  useEffect(() => {
    // Reset copied state when value changes
    setIsCopied(false);
  }, [value]);
  
  const characterCount = value.length;

  return (
    <div className="relative w-full h-64 flex flex-col">
      <div className="relative flex-grow">
        <textarea
          id={id}
          value={value}
          readOnly={isReadOnly}
          {...props}
          className="w-full h-full p-4 pr-12 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />
        {!isReadOnly && value && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear text"
          >
            <ClearIcon className="w-5 h-5" />
          </button>
        )}
        {isReadOnly && value && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Copy to clipboard"
          >
            {isCopied ? (
              <CheckIcon className="w-5 h-5 text-green-400" />
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded-lg">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="text-right text-xs text-slate-500 pt-2 px-1">
        {characterCount} characters
      </div>
    </div>
  );
};
