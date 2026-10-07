import React, { useState } from 'react';
import { GeneratedContentResponse } from '../types';
import {
  BookOpen,
  Clock,
  Calendar,
  Share2,
  Copy,
  Check,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  Sparkles,
  FileCode
} from 'lucide-react';

interface ArticleViewProps {
  content: GeneratedContentResponse;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ content }) => {
  const [copiedFormat, setCopiedFormat] = useState<'md' | 'html' | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const article = content?.articleContent || {
    introduction: '',
    sections: [],
    conclusion: '',
    faqs: [],
  };

  const sections = Array.isArray(article.sections) ? article.sections : [];
  const faqs = Array.isArray(article.faqs) ? article.faqs : [];
  const mediaPrompts = Array.isArray(content?.suggestedMedia?.inContentImagePrompts)
    ? content.suggestedMedia.inContentImagePrompts
    : [];

  const handleCopyMarkdown = () => {
    let md = `# ${content?.h1Title || 'Article'}\n\n`;
    md += `*Primary Keyword: ${content?.primaryKeyword || ''} | Read Time: ${content?.estimatedReadTimeMinutes || 5} mins*\n\n`;
    md += `${article.introduction || ''}\n\n`;

    sections.forEach((sec) => {
      md += `${sec.level === 'h3' ? '###' : '##'} ${sec.heading}\n\n`;
      md += `${sec.content}\n\n`;
      if (sec.calloutTip) {
        md += `> **Pro Tip:** ${sec.calloutTip}\n\n`;
      }
    });

    md += `## Conclusion\n\n${article.conclusion || ''}\n\n`;

    if (faqs.length) {
      md += `## Frequently Asked Questions\n\n`;
      faqs.forEach((faq) => {
        md += `### ${faq.question}\n${faq.answer}\n\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopiedFormat('md');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyHtml = () => {
    let html = `<article class="rankcraft-seo-article">\n`;
    html += `  <h1>${content?.h1Title || 'Article'}</h1>\n`;
    html += `  <p class="lead">${article.introduction || ''}</p>\n`;

    sections.forEach((sec) => {
      html += `  <${sec.level}>${sec.heading}</${sec.level}>\n`;
      html += `  <p>${sec.content}</p>\n`;
      if (sec.calloutTip) {
        html += `  <aside class="callout-tip"><strong>Pro Tip:</strong> ${sec.calloutTip}</aside>\n`;
      }
    });

    html += `  <h2>Conclusion</h2>\n`;
    html += `  <p>${article.conclusion || ''}</p>\n`;

    if (faqs.length) {
      html += `  <section class="faqs">\n    <h2>Frequently Asked Questions</h2>\n`;
      faqs.forEach((faq) => {
        html += `    <div class="faq-item">\n      <h3>${faq.question}</h3>\n      <p>${faq.answer}</p>\n    </div>\n`;
      });
      html += `  </section>\n`;
    }

    html += `</article>`;
    navigator.clipboard.writeText(html);
    setCopiedFormat('html');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Article Top Bar */}
      <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            SEO Pillar Article Reader
          </span>
          <span className="text-xs text-slate-500 font-mono">
            • {content.urlSlug}
          </span>
        </div>

        {/* Copy export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedFormat === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedFormat === 'md' ? 'Copied MD' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleCopyHtml}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedFormat === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
            {copiedFormat === 'html' ? 'Copied HTML' : 'Copy HTML'}
          </button>
        </div>
      </div>

      {/* Article Body */}
      <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-8">
        {/* H1 Header & Metadata */}
        <div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight mb-4 tracking-tight">
            {content.h1Title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-6 border-b border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {content.estimatedReadTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Updated October 2026
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
              Target: {content.primaryKeyword}
            </span>
          </div>
        </div>

        {/* Lead Introduction */}
        <div className="text-base text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
          <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:mr-2 first-letter:float-left">
            {article.introduction}
          </p>
        </div>

        {/* Article Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => {
            const mediaItem = mediaPrompts[idx];

            return (
              <section key={idx} className="flex flex-col gap-4">
                {section.level === 'h3' ? (
                  <h3 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-amber-400">#</span>
                    {section.heading}
                  </h3>
                ) : (
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-white border-b border-slate-800/80 pb-2">
                    {section.heading}
                  </h2>
                )}

                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>

                {/* Callout Pro Tip if present */}
                {section.calloutTip && (
                  <div className="bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-2xl text-xs text-amber-200/90 flex items-start gap-3 my-2 shadow-inner">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400 font-bold block mb-0.5">
                        Authoritative Editor Insight:
                      </strong>
                      <span>{section.calloutTip}</span>
                    </div>
                  </div>
                )}

                {/* In-content image anchor placeholder */}
                {mediaItem && (
                  <div className="my-2 bg-slate-950 border border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      In-Content Media Placement Slot #{idx + 1}: {mediaItem.title}
                    </div>
                    <p className="text-[11px] text-slate-400 italic max-w-lg">
                      "{mediaItem.caption}"
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Alt: {mediaItem.altText}
                    </span>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-xl font-serif font-bold text-white mb-2">
            The Bottom Line
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {article.conclusion}
          </p>
        </div>

        {/* Frequently Asked Questions Section */}
        {faqs.length > 0 && (
          <div className="mt-4 pt-6 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Frequently Asked Questions (FAQ Schema Ready)
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
