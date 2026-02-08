import AiSummarizer from '@/components/AiSummarizer';

/**
 * 🤖 AI SUMMARIZER PAGE
 * 
 * This page integrates the real-time AI summarizer component.
 * Access it at: http://localhost:3000/ai-summarizer
 * 
 * Features:
 * - Real-time streaming from Ollama mistral:7b
 * - Server-Sent Events (SSE) for instant token display
 * - Beautiful glassmorphism UI
 * - Auto-scrolling summary view
 */
export default function AiSummarizerPage() {
    return <AiSummarizer />;
}
