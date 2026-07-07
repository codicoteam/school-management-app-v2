import { MessageStatus } from "@/hooks/useChat";

interface MessageTickProps {
  status: MessageStatus | undefined;
  isSender: boolean;
  className?: string;
}

/**
 * WhatsApp-style message tick:
 * - 'sending' → clock icon (gray)
 * - 'sent'    → single gray tick
 * - 'delivered' → double gray tick
 * - 'read'    → double blue tick
 */
const MessageTick = ({ status, isSender }: MessageTickProps) => {
  if (!isSender) return null;

  if (status === 'sending') {
    return (
      <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" className="text-gray-400 opacity-70">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (status === 'sent') {
    // Single gray tick
    return (
      <svg viewBox="0 0 12 11" width="14" height="11" fill="currentColor" className="text-gray-400">
        <path d="M1 6l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  if (status === 'delivered') {
    // Double gray tick
    return (
      <svg viewBox="0 0 18 11" width="18" height="11" fill="none" className="text-gray-400">
        <path d="M1 6l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6l3.5 3.5L16 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (status === 'read') {
    // Double blue tick
    return (
      <svg viewBox="0 0 18 11" width="18" height="11" fill="none" className="text-blue-500">
        <path d="M1 6l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6l3.5 3.5L16 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Fallback: double gray tick for legacy messages without status
  return (
    <svg viewBox="0 0 18 11" width="18" height="11" fill="none" className="text-gray-400">
      <path d="M1 6l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6l3.5 3.5L16 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default MessageTick;
