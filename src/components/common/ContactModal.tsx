import React, { useState } from 'react';
import { X, Send, Heart, HelpCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendContactMessage } from '../../services/contactService';
import { AlpanaCircle } from './AlpanaMotif';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'query' | 'appreciation'>('query');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (type === 'query' && !email.trim()) {
      setErrorMessage('Email is required for queries so our team can reply to you.');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
    }

    if (!message.trim()) {
      setErrorMessage('Please write your message.');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactMessage({
        name: name.trim(),
        type,
        email: email.trim() || undefined,
        message: message.trim(),
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Failed to send contact message:', err);
      const serverMsg = err.response?.data?.message;
      setErrorMessage(
        serverMsg || 'Failed to send message. Please ensure network is reachable or try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setMessage('');
    setType('query');
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-ivory-surface dark:bg-obsidian-100 rounded-3xl border border-ivory-border dark:border-obsidian-300 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Festive Alpana Glow */}
        <div className="absolute -top-12 -right-12 pointer-events-none opacity-15">
          <AlpanaCircle size={220} opacity={0.25} />
        </div>

        {/* Modal Header */}
        <div className="relative z-10 px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-5 border-b border-stone-100 dark:border-obsidian-300 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-vermilion">
                Get In Touch
              </span>
              <span className="text-xs text-charcoal-subtle dark:text-stone-500">•</span>
              <span className="text-xs md:text-sm font-bengali text-charcoal-muted dark:text-stone-400">
                যোগাযোগ ও বার্তা
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-charcoal dark:text-stone-100 mt-0.5">
              Contact Us
            </h3>
            <p className="text-xs md:text-sm text-charcoal-muted dark:text-stone-400 mt-1 max-w-xl leading-relaxed italic">
              "Whether you're seeking festival guidance, curious about routes, or sharing warm
              Sharadotsav appreciation — your voice brings PujaPath alive."
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 md:p-2 rounded-full text-stone-400 hover:text-charcoal dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-obsidian-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl md:text-2xl font-bold text-charcoal dark:text-stone-100">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Our developer team will review your message and reply
                  back through your email address.
                </p>
              </div>
              <button
                onClick={handleResetAndClose}
                className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-xl bg-vermilion text-white text-xs md:text-sm font-semibold hover:bg-vermilion-dark transition-colors shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Message Type Selector */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-charcoal dark:text-stone-200 mb-2">
                  Message Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setType('query');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                      type === 'query'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-stone-200 dark:border-obsidian-300 bg-ivory-warm/70 dark:bg-obsidian-200/60 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    <span>Query / Question</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType('appreciation');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                      type === 'appreciation'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-stone-200 dark:border-obsidian-300 bg-ivory-warm/70 dark:bg-obsidian-200/60 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
                    <span>Appreciation / Love</span>
                  </button>
                </div>
              </div>

              {/* Name & Email in responsive 2-column on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-charcoal dark:text-stone-200 mb-1.5">
                    Your Name <span className="text-vermilion">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sourav Mukherjee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 text-xs md:text-sm bg-ivory-warm dark:bg-obsidian-200/70 border border-ivory-border dark:border-obsidian-300 rounded-xl text-charcoal dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-vermilion/40 transition-all"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-charcoal dark:text-stone-200 mb-1.5">
                    Email Address{' '}
                    {type === 'query' ? (
                      <span className="text-vermilion font-bold">* (Required)</span>
                    ) : (
                      <span className="text-stone-400 font-normal">(Optional)</span>
                    )}
                  </label>
                  <input
                    type="email"
                    required={type === 'query'}
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 text-xs md:text-sm bg-ivory-warm dark:bg-obsidian-200/70 border border-ivory-border dark:border-obsidian-300 rounded-xl text-charcoal dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-vermilion/40 transition-all"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-charcoal dark:text-stone-200 mb-1.5">
                  Message <span className="text-vermilion">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    type === 'query'
                      ? 'Tell us what you need help with or any route/pandal questions...'
                      : 'Share what you loved or feedback about PujaPath...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 text-xs md:text-sm bg-ivory-warm dark:bg-obsidian-200/70 border border-ivory-border dark:border-obsidian-300 rounded-xl text-charcoal dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-vermilion/40 resize-none transition-all"
                />
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs md:text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-vermilion to-vermilion-dark hover:from-vermilion-dark hover:to-vermilion text-white font-semibold text-xs md:text-sm shadow-warm-md flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Reply mention line below button */}
                <p className="text-[11px] md:text-xs text-center text-charcoal-muted dark:text-stone-400 mt-2.5 leading-relaxed">
                  ✉️ Our developer team will review your message and reply back through your email.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
