import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  if (!content) return null;

  // Render markdown lines cleanly
  const lines = content.split('\n');

  return (
    <div className="prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed text-sm sm:text-base space-y-4">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 border-b border-slate-800 pb-2 mt-6">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg sm:text-xl font-bold font-mono text-emerald-400 border-b border-slate-800/60 pb-1 mt-6 flex items-center space-x-2">
              <span className="text-slate-500 font-mono">//</span>
              <span>{trimmed.replace('## ', '')}</span>
            </h2>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-semibold font-mono text-amber-300 mt-4">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <li key={idx} className="ml-5 list-disc text-slate-300 font-mono text-xs sm:text-sm my-1">
              {trimmed.replace(/^[-*]\s+/, '')}
            </li>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-2 border-emerald-500 bg-emerald-950/20 px-4 py-2 my-3 text-slate-300 text-xs sm:text-sm font-mono rounded-r">
              {trimmed.replace('> ', '')}
            </blockquote>
          );
        }

        if (trimmed === '') {
          return <div key={idx} className="h-2" />;
        }

        return (
          <p key={idx} className="text-slate-300 leading-relaxed text-xs sm:text-sm">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};
