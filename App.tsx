
import React, { useState, useCallback } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationTextArea } from './components/TranslationTextArea';
import { SwapIcon, TranslateIcon } from './components/Icons';
import { LANGUAGES } from './constants';
import { translateText } from './services/geminiService';
import type { Language } from './types';

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('es');
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError('An error occurred during translation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang]);

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLang, targetLang, sourceText, translatedText]);

  const handleClearText = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <main className="w-full max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-2">
            Gemini Language Translator
          </h1>
          <p className="text-md text-slate-400">
            Real-time translation powered by Google's Gemini API
          </p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <LanguageSelector
              id="source-language"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              languages={LANGUAGES}
              className="w-full sm:w-auto flex-1"
            />
            <button
              onClick={handleSwapLanguages}
              className="p-2 rounded-full bg-slate-700 hover:bg-blue-600 transition-colors duration-200 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Swap languages"
            >
              <SwapIcon className="w-6 h-6" />
            </button>
            <LanguageSelector
              id="target-language"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              languages={LANGUAGES}
              className="w-full sm:w-auto flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TranslationTextArea
              id="source-text"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              isReadOnly={false}
              lang={sourceLang}
              onClear={handleClearText}
            />
            <TranslationTextArea
              id="translated-text"
              value={translatedText}
              placeholder="Translation will appear here..."
              isReadOnly={true}
              isLoading={isLoading}
              lang={targetLang}
            />
          </div>

          {error && (
            <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="flex items-center justify-center gap-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <TranslateIcon className="w-6 h-6" />
                  <span>Translate</span>
                </>
              )}
            </button>
          </div>
        </div>
        <footer className="text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Gemini Translator. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
