import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../services/api';

export default function AIecoCoach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [dailyTip, setDailyTip] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [tips, setTips] = useState([]);
  const messagesEndRef = useRef(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial data
  useEffect(() => {
    if (userId) {
      loadInitialData();
    }
  }, [userId]);

  const loadInitialData = async () => {
    try {
      const [insightData, trendData, tipData] = await Promise.all([
        aiAPI.getPersonalizedInsight(userId),
        aiAPI.analyzeTrend(userId),
        aiAPI.getDailyTip()
      ]);

      setInsight(insightData);
      setTrendAnalysis(trendData);
      setDailyTip(tipData);

      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: `Hi ${user.name}! 👋 I'm your AI EcoCoach. I'm here to help you reduce your carbon footprint with personalized advice. What would you like to know about your emissions?`,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Load tips for selected category
  useEffect(() => {
    if (userId && selectedCategory) {
      loadTips();
    }
  }, [selectedCategory, userId]);

  const loadTips = async () => {
    try {
      const tipsData = await aiAPI.getReductionTips(selectedCategory, userId);
      setTips(tipsData.tips || []);
    } catch (error) {
      console.error('Error loading tips:', error);
    }
  };

  // Send message to AI
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get AI response
      const response = await aiAPI.chatWithCoach(userId, userMessage, conversationHistory);

      // Add AI response to chat
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.response,
          timestamp: response.timestamp
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: 'Reduce transport emissions', icon: '🚗' },
    { label: 'Lower energy usage', icon: '⚡' },
    { label: 'Sustainable food choices', icon: '🍽️' },
    { label: 'Analyze my progress', icon: '📊' }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action.label);
  };

  // Categories for tips
  const categories = [
    { value: 'general', label: 'General', icon: '🌍' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'energy', label: 'Energy', icon: '⚡' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'waste', label: 'Waste', icon: '🗑️' }
  ];

  // Get trend color
  const getTrendColor = (trend) => {
    if (trend === 'decreasing') return 'text-green-600';
    if (trend === 'increasing') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'decreasing') return '📉';
    if (trend === 'increasing') return '📈';
    return '➡️';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI EcoCoach 🤖</h1>
          <p className="text-gray-600">Get personalized sustainability advice powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Insights & Tips */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Tip */}
            {dailyTip && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💡</span>
                  <h3 className="font-semibold text-lg">Daily Tip</h3>
                </div>
                <p className="text-sm leading-relaxed">{dailyTip.tip}</p>
              </div>
            )}

            {/* Personalized Insight */}
            {insight && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-semibold text-lg text-gray-900">Your Insight</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{insight.insight}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">{insight.category}</span>
                  <span>•</span>
                  <span>{insight.source === 'ai' ? 'AI Generated' : 'Curated'}</span>
                </div>
              </div>
            )}

            {/* Trend Analysis */}
            {trendAnalysis && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{getTrendIcon(trendAnalysis.trend)}</span>
                  <h3 className="font-semibold text-lg text-gray-900">Trend Analysis</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">{trendAnalysis.insight}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-500 text-xs mb-1">This Week</p>
                    <p className="font-semibold text-gray-900">{trendAnalysis.recent_week_avg} kg/day</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-500 text-xs mb-1">Change</p>
                    <p className={`font-semibold ${getTrendColor(trendAnalysis.trend)}`}>
                      {trendAnalysis.change_percent > 0 ? '+' : ''}{trendAnalysis.change_percent}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reduction Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Reduction Tips</h3>
              
              {/* Category Selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tips List */}
              <div className="space-y-2">
                {tips.length > 0 ? (
                  tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <p>{tip}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading tips...</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: '700px' }}>
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">EcoCoach AI</h3>
                    <p className="text-xs text-gray-500">Your personal sustainability advisor</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-bounce">💭</div>
                        <p className="text-sm text-gray-600">Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="mr-1">{action.icon}</span>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about reducing your carbon footprint..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}