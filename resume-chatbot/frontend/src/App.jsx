import { useEffect, useRef, useState } from "react";

export default function App() {
  const [sessionId] = useState("default");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi ask me anything about my resume." },
    { role: "user", content: "Can you tell me about your work experience?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((msgs) => [...msgs, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const payload = { session_id: sessionId, question: userMessage };
      const res = await fetch("https://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const { answer } = await res.json();
      setMessages((msgs) => [...msgs, { role: "assistant", content: answer }]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to pink-500 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from purple-400 to-pink-400 bg-clip-text text-transparent">
            Resume Assistant
          </h1>
          <p className="text-slate-300 text-lg">
            Ask me anything about my background and experience
          </p>
        </div>
        {/* chat container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* message area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm"
                      : "bg-white/90 text-slate-800 rounded-bl-sm border border-white/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}

            {/* loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg border border-white/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-6 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/20">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus-border-transparent text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about skills, experience, projects..."
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={send}
                disabled={!input.trim() || isLoading}
                className="px-8 py-4 bg-gradient-to-r from purple-500 to-pink-500 text-white rounded-2xl font-medium shadow-lg hover-shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* footer/ */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>Powered by AI • Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
