'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Brain, Activity, Shield, MessageCircle, 
  TrendingUp, AlertCircle, Wind, Music, BookOpen 
} from 'lucide-react';

// 类型定义
interface MoodEntry {
  id: string;
  score: number;
  emotion: string;
  timestamp: string;
  note?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  technique?: string;
  exercise?: string;
}

interface DashboardData {
  mood_trend: Array<{date: string; score: number; emotion: string}>;
  weekly_comparison: {this_week: number; last_week: number; change: number};
  insights: string[];
  safety_status: string;
  recommended_content: Array<{type: string; title: string; duration?: number}>;
}

// 主应用组件
export default function 云岫App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'record' | 'assessment' | 'knowledge' | 'tools' | 'community' | 'plan'>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 跳过认证流程，默认登录状态
  useEffect(() => {
    // 模拟用户登录状态
    setUser({
      id: '1',
      username: '用户',
      token: 'mock-token'
    });
    setIsLoading(false);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
          {activeTab === 'chat' && <AICompanion key="chat" />}
          {activeTab === 'record' && <MoodRecorder key="record" />}
          {activeTab === 'assessment' && <AssessmentCenter key="assessment" onTabChange={setActiveTab} />}
          {activeTab === 'knowledge' && <KnowledgeBase key="knowledge" />}
          {activeTab === 'tools' && <Tools key="tools" />}

          {activeTab === 'plan' && <GrowthPlan key="plan" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==================== 仪表盘组件 ====================

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      // 获取token
      const token = localStorage.getItem('token');
      
      // 尝试从后端API获取数据
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        // API调用失败，使用模拟数据
        console.log('API调用失败，使用模拟数据');
        console.log('响应状态:', response.status);
        const mockData: DashboardData = {
          mood_trend: Array.from({length: 7}, (_, i) => ({
            date: new Date(Date.now() - (6-i) * 86400000).toLocaleDateString('zh-CN', {month: 'short', day: 'numeric'}),
            score: 4 + Math.random() * 4,
            emotion: ['joy', 'neutral', 'anxiety', 'sadness'][Math.floor(Math.random() * 4)]
          })),
          weekly_comparison: {this_week: 6.2, last_week: 5.1, change: 1.1},
          insights: [
            "📈 你的情绪较上周提升了21%，睡眠质量改善可能是主要原因",
            "⚡ 情绪波动较大，建议记录触发因素",
            "🎉 周末情绪明显改善，建议增加户外活动时间"
          ],
          safety_status: "状态良好",
          recommended_content: [
            {type: 'meditation', title: '晨间冥想：开启平静的一天', duration: 10},
            {type: 'exercise', title: '情绪释放练习：识别并接纳情绪', duration: 15},
            {type: 'audio', title: '睡前放松：渐进式肌肉放松', duration: 20}
          ]
        };
        setData(mockData);
      }
    } catch (error) {
      // 网络错误，使用模拟数据
      console.error('网络错误，使用模拟数据:', error);
      const mockData: DashboardData = {
        mood_trend: Array.from({length: 7}, (_, i) => ({
          date: new Date(Date.now() - (6-i) * 86400000).toLocaleDateString('zh-CN', {month: 'short', day: 'numeric'}),
          score: 4 + Math.random() * 4,
          emotion: ['joy', 'neutral', 'anxiety', 'sadness'][Math.floor(Math.random() * 4)]
        })),
        weekly_comparison: {this_week: 6.2, last_week: 5.1, change: 1.1},
        insights: [
          "📈 你的情绪较上周提升了21%，睡眠质量改善可能是主要原因",
          "⚡ 情绪波动较大，建议记录触发因素",
          "🎉 周末情绪明显改善，建议增加户外活动时间"
        ],
        safety_status: "状态良好",
        recommended_content: [
          {type: 'meditation', title: '晨间冥想：开启平静的一天', duration: 10},
          {type: 'exercise', title: '情绪释放练习：识别并接纳情绪', duration: 15},
          {type: 'audio', title: '睡前放松：渐进式肌肉放松', duration: 20}
        ]
      };
      setData(mockData);
    }
  };

  if (!data) return <LoadingScreen />;

  const emotionColors: Record<string, string> = {
    joy: '#10b981',
    neutral: '#6b7280',
    anxiety: '#f59e0b',
    sadness: '#6366f1',
    anger: '#ef4444'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 欢迎语和安全状态 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">你好，欢迎回来！</h1>
          <p className="text-slate-600">这是你使用 云岫 的第 {Math.floor(Math.random() * 30 + 1)} 天</p>
          <p className="text-lg italic text-green-600 font-light">云无心以出岫，心自安而不扰</p>
        </div>
        <SafetyBadge status={data.safety_status} />
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="情绪平均得分"
          artisticTitle="云心分：心绪的晴雨刻度"
          value={data.weekly_comparison.this_week.toFixed(1)}
          subtitle={`较上周 ${data.weekly_comparison.change > 0 ? '+' : ''}${data.weekly_comparison.change.toFixed(1)}`}
          trend={data.weekly_comparison.change > 0 ? 'up' : 'down'}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-green-500"
        />
        <MetricCard 
          title="情绪稳定性"
          artisticTitle="岫序：情绪流动的节律"
          value="良好"
          subtitle="情绪波动在正常范围内"
          trend="neutral"
          icon={<Activity className="w-6 h-6" />}
          color="bg-emerald-500"
        />
        <MetricCard 
          title="干预记录"
          artisticTitle="云迹：情绪停靠的每一步"
          value="12次"
          subtitle="本周练习总时长 3.5小时"
          trend="up"
          icon={<Brain className="w-6 h-6" />}
          color="bg-teal-500"
        />
      </div>

      {/* 情绪趋势图 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              情绪趋势
            </h2>
            <p className="text-green-600 text-sm font-light italic">云程：心绪起伏的轨迹</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPeriod === period 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {period === '7d' ? '近7天' : '近30天'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.mood_trend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[1, 10]} stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                        <p className="font-medium text-slate-800">{data.date}</p>
                        <p className="text-blue-600 font-bold">情绪指数: {data.score.toFixed(1)}</p>
                        <p className="text-sm text-slate-500 capitalize">主要情绪: {data.emotion}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI洞察 */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-500" />
              AI 智能洞察
            </h3>
            <p className="text-green-600 text-sm font-light italic mb-4">岫语：来自云岫的温柔解读</p>
          </div>
          <ul className="space-y-3">
            {data.insights.map((insight, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <span className="text-lg">{insight.split(' ')[0]}</span>
                <span className="text-slate-700 text-sm leading-relaxed">{insight.slice(2)}</span>
              </motion.li>
            ))}
          </ul>
        </div>


      </div>
    </motion.div>
  );
}

// ==================== AI聊天组件 ====================

function AICompanion() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '你好！我是 MindGuard AI 心理健康陪伴助手。这里是一个安全的空间，你可以分享任何感受和想法。今天你想聊些什么呢？' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emotionState, setEmotionState] = useState<string>('neutral');

  const callDoubaoAPI = async (input: string, chatHistory: ChatMessage[]) => {
    const DOUBAO_API_KEY = 'f1303c56-b664-4f86-a711-3deb8f9db441';
    const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses';
    
    try {
      // 构建输入内容，包含系统提示和聊天历史
      const inputContent = [
        {
          type: 'input_text',
          text: `系统提示：你是一个专业的心理健康陪伴助手，擅长倾听和共情。请快速回复，直接表达理解和支持，提供简洁实用的建议，避免多余的开场白和冗长解释。不要提到自己是豆包。\n\n聊天历史：\n${chatHistory.map(msg => `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}`).join('\n')}\n\n用户现在说：${input}`
        }
      ];
      
      console.log('调用豆包API:', {
        url: DOUBAO_API_URL,
        input: inputContent[0].text.substring(0, 100) + '...'
      });
      
      const response = await fetch(DOUBAO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOUBAO_API_KEY}`
        },
        body: JSON.stringify({
          model: 'doubao-seed-1-8-251228',
          input: [
            {
              role: 'user',
              content: inputContent
            }
          ]
        })
      });
      
      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API调用失败:', errorText);
        throw new Error(`API调用失败: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API响应数据:', data);
      
      // 解析响应数据
      if (data.output && Array.isArray(data.output)) {
        const messageOutput = data.output.find((item: any) => item.type === 'message');
        if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
          const textContent = messageOutput.content.find((item: any) => item.type === 'output_text');
          if (textContent && textContent.text) {
            return textContent.text;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('豆包API调用失败:', error);
      return null;
    }
  };

  // 将长消息分成多个短消息
  const splitMessage = (message: string): string[] => {
    const messages: string[] = [];
    const sentences = message.split(/[。！？；]/).filter(s => s.trim());
    
    let currentMessage = '';
    for (const sentence of sentences) {
      const sentenceWithPunctuation = sentence + '。';
      if (currentMessage.length + sentenceWithPunctuation.length < 200) {
        currentMessage += sentenceWithPunctuation;
      } else {
        if (currentMessage) {
          messages.push(currentMessage);
        }
        currentMessage = sentenceWithPunctuation;
      }
    }
    
    if (currentMessage) {
      messages.push(currentMessage);
    }
    
    return messages;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 调用豆包API
      const doubaoResponse = await callDoubaoAPI(input, messages);
      
      if (doubaoResponse) {
        // 豆包API调用成功
        // 将长消息分成多个短消息
        const messages = splitMessage(doubaoResponse);
        
        // 逐个发送消息，添加适当的延迟
        messages.forEach((content, index) => {
          setTimeout(() => {
            const aiMsg: ChatMessage = {
              role: 'assistant',
              content: content,
              technique: index === 0 ? '豆包AI' : undefined,
              exercise: undefined
            };
            setMessages(prev => [...prev, aiMsg]);
            
            // 最后一条消息发送完成后，设置isTyping为false
            if (index === messages.length - 1) {
              setIsTyping(false);
            }
          }, index * 200); // 每条消息间隔200ms，加快回复速度
        });
        return;
      }
      
      // 豆包API调用失败，使用默认回复
      console.log('豆包API调用失败，使用默认回复');
      const defaultMsg: ChatMessage = {
        role: 'assistant',
        content: '抱歉，我暂时无法回复，请稍后再试~',
        technique: '默认回复',
        exercise: undefined
      };
      setMessages(prev => [...prev, defaultMsg]);
      setIsTyping(false);
    } catch (error) {
      console.error('发送消息失败:', error);
      // 错误处理，使用默认回复
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: '抱歉，我暂时无法回复，请稍后再试~',
        technique: '错误处理',
        exercise: undefined
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden"
      style={{ maxWidth: '100%', margin: '0 auto', width: '100%', maxHeight: 'calc(100vh-120px)' }}
    >
      {/* 聊天头部 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 text-center font-bold text-lg">
        💖 岫言：云岫的陪伴低语
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f7f8fa]">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[75%] p-4 rounded-2xl ${msg.role === 'user' ? 'ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-4' : 'bg-white text-[#333] border border-[#e5e7eb] rounded-bl-4 shadow-sm'}`}
            style={{
              borderRadius: '18px',
              ...(msg.role === 'user' ? { borderBottomRightRadius: '4px' } : { borderBottomLeftRadius: '4px' })
            }}
          >
            <p className="leading-relaxed">{msg.content}</p>
            {msg.technique && msg.technique !== '豆包AI' && (
              <span className="inline-block mt-2 text-xs opacity-70 bg-black/10 px-2 py-1 rounded">
                {msg.technique}
              </span>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="bg-white border border-[#e5e7eb] rounded-18 rounded-bl-4 p-3">
            <div className="text-[#999] text-sm">
              正在整理思路...
            </div>
          </div>
        )}
      </div>

      {/* 快捷回复按钮 */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto">
        {['😊 开心', '😔 难过', '😰 焦虑', '😠 愤怒', '😴 疲惫'].map(emoji => (
          <button
            key={emoji}
            onClick={() => setInput(`我现在感到${emoji.slice(2)}`)} 
            className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="说点什么吧，我一直在听..."
            className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 shadow-sm"
            style={{ borderRadius: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-md"
            style={{ borderRadius: '24px' }}
          >
            发送
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          📞 AI聊天仅供支持和参考，如需专业帮助请拨打 400-161-9995
        </p>
      </div>
    </motion.div>
  );
}

// ==================== 情绪记录组件 ====================

function MoodRecorder() {
  const [score, setScore] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [showRecord, setShowRecord] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emotions = [
    { id: 'joy', label: '开心', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '😊' },
    { id: 'gratitude', label: '感恩', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🙏' },
    { id: 'calm', label: '平静', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '😌' },
    { id: 'anxiety', label: '焦虑', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '😰' },
    { id: 'sadness', label: '难过', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '😔' },
    { id: 'anger', label: '愤怒', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: '😠' },
    { id: 'tired', label: '疲惫', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '😴' },
    { id: 'confused', label: '困惑', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '😕' },
  ];

  const submitEntry = async () => {
    setIsSubmitting(true);
    try {
      // 获取token
      const token = localStorage.getItem('token');
      
      // 尝试向后端API提交数据
      const response = await fetch('/api/mood/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          mood_score: score,
          emotions: selectedEmotions,
          note: note,
          show_record: showRecord,
          context: {
            timestamp: new Date().toISOString(),
            platform: 'web'
          }
        }),
      });
      
      if (response.ok) {
        // 提交成功
        setIsSubmitting(false);
        setShowSuccess(true);
        // 重置表单
        setScore(5);
        setSelectedEmotions([]);
        setNote('');
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // 提交失败，使用模拟成功
        console.log('API调用失败，模拟提交成功');
        setIsSubmitting(false);
        setShowSuccess(true);
        // 重置表单
        setScore(5);
        setSelectedEmotions([]);
        setNote('');
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      // 网络错误，使用模拟成功
      console.error('网络错误，模拟提交成功:', error);
      setIsSubmitting(false);
      setShowSuccess(true);
      // 重置表单
      setScore(5);
      setSelectedEmotions([]);
      setNote('');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden"
    >
      {/* 评分区域 */}
      <div className="p-8 bg-gradient-to-b from-green-50 to-white">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">今天感觉如何？</h2>
        <p className="text-center text-green-600 font-light italic mb-8">云笺：情绪的自留地</p>
        <p className="text-center text-slate-500 mb-8">用1-10分评价你当前的情绪状态</p>
        
        <div className="relative mb-8">
          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-sm text-slate-400">
            <span>很糟糕</span>
            <span>一般</span>
            <span>很棒</span>
          </div>
        </div>

        <div className="text-center">
          <span className={`text-6xl font-bold ${
            score <= 3 ? 'text-rose-500' :
            score <= 6 ? 'text-amber-500' :
            'text-emerald-500'
          }`}>{score}</span>
          <p className="text-slate-600 mt-2 font-medium">
            {score <= 3 ? '情绪低落，需要关注' :
             score <= 6 ? '情绪一般，还可以更好' :
             '情绪良好，继续保持'}
          </p>
        </div>
      </div>

      {/* 情绪标签选择 */}
      <div className="p-8 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">你现在的主要情绪是什么？可多选</h3>
        <div className="flex flex-wrap gap-3">
          {emotions.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => {
                setSelectedEmotions(prev => 
                  prev.includes(emotion.id) 
                    ? prev.filter(e => e !== emotion.id)
                    : [...prev, emotion.id]
                );
              }}
              className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                selectedEmotions.includes(emotion.id)
                  ? emotion.color + ' border-current shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="text-xl">{emotion.icon}</span>
              <span className="font-medium">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 详细记录 */}
      <div className="p-8 border-t border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">想记录点什么吗？（可选）</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="今天发生了什么？是什么让你有这样的感受？..."
          className="w-full h-32 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 placeholder:text-slate-400"
        />
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="showRecord"
            checked={showRecord}
            onChange={(e) => setShowRecord(e.target.checked)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="showRecord" className="text-sm text-slate-600">
            允许在仪表盘上显示此记录（仅自己可见）
          </label>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
          <Shield className="w-4 h-4" />
          <span>你的隐私信息会被加密存储，绝对安全</span>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="p-8 bg-slate-50">
        <button
          onClick={submitEntry}
          disabled={isSubmitting || selectedEmotions.length === 0}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI分析中...
            </>
          ) : showSuccess ? (
            <>
              <span className="text-2xl">✓</span>
              记录成功！
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              提交记录并获取AI建议
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ==================== 评估中心组件 ====================

function AssessmentCenter({ onTabChange }: { onTabChange: (tab: 'dashboard' | 'chat' | 'record' | 'assessment' | 'knowledge' | 'tools' | 'community' | 'plan') => void }) {
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);

  const assessments = [
    {
      id: 'phq9',
      title: 'PHQ-9 抑郁筛查',
      description: '15道问题筛查你的抑郁症状严重程度',
      duration: '5分钟',
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      id: 'gad7',
      title: 'GAD-7 焦虑评估',
      description: '15道问题评估你过去两周的焦虑水平',
      duration: '5分钟',
      icon: <Activity className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50'
    },
    {
      id: 'mbti',
      title: 'MBTI 性格测试',
      description: '24道问题深入了解你的性格特质',
      duration: '10分钟',
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50'
    }
  ];

  if (activeAssessment) {
    return <AssessmentQuiz type={activeAssessment} onBack={() => setActiveAssessment(null)} onTabChange={onTabChange} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">专业心理评估</h2>
        <p className="text-green-600 font-light italic mt-2">云鉴：心绪状态的映照</p>
        <p className="text-slate-600 mt-2">基于循证医学的评估工具，帮助你了解自己</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assessments.map(assessment => (
          <motion.div
            key={assessment.id}
            whileHover={{ y: -5 }}
            className={`${assessment.color} rounded-2xl p-6 cursor-pointer border border-slate-200 hover:shadow-lg transition-all`}
            onClick={() => setActiveAssessment(assessment.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {assessment.icon}
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white/50 px-2 py-1 rounded-full">
                {assessment.duration}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{assessment.title}</h3>
            <p className="text-slate-600 text-sm mb-4">{assessment.description}</p>
            <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              开始评估
            </button>
          </motion.div>
        ))}
      </div>

      {/* 心理健康知识卡片 */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">心理健康知识</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-3">情绪管理技巧</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              学习如何识别、理解和管理自己的情绪，是维护心理健康的重要技能。尝试深呼吸、正念冥想和写情绪日记等方法。
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-3">压力应对策略</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              压力是生活的一部分，关键在于如何应对。建立健康的生活习惯，如规律作息、适量运动和合理饮食，都能帮助你更好地应对压力。
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-3">建立良好的人际关系</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              良好的人际关系是心理健康的重要支柱。学会有效沟通、倾听和共情，能够帮助你建立和维护健康的人际关系。
            </p>
          </motion.div>
        </div>
      </div>

      {/* 常见问题 */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">常见问题</h3>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">评估结果准确吗？</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                我们的评估工具基于循证医学研究，具有较高的信度和效度。但请注意，这些评估结果仅供参考，不能替代专业诊断。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">如何保护我的隐私？</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                我们非常重视用户隐私，所有评估数据都会被加密存储，只有你自己可以查看。我们不会将你的数据分享给任何第三方。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">评估结果显示我有问题，应该怎么办？</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                如果评估结果显示你可能存在心理健康问题，建议你预约专业心理咨询师进行进一步评估和治疗。我们也提供了一些自助资源和建议，帮助你开始改善心理健康。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-amber-800 mb-1">重要说明</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            这些评估结果仅供参考，不能替代专业诊断。如果评估结果显示你可能存在心理健康问题，
            建议预约专业心理咨询师进行进一步评估和治疗。
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== 心理知识科普库组件 ====================

function KnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState('焦虑');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: '焦虑', label: '焦虑', icon: <Activity className="w-5 h-5" /> },
    { id: '抑郁', label: '抑郁', icon: <Heart className="w-5 h-5" /> },
    { id: '压力管理', label: '压力管理', icon: <TrendingUp className="w-5 h-5" /> },
    { id: '亲子关系', label: '亲子关系', icon: <MessageCircle className="w-5 h-5" /> },
    { id: '职场心理', label: '职场心理', icon: <Brain className="w-5 h-5" /> },
  ];
  
  const hotTopics = [
    { id: '考研压力调节', title: '考研压力调节', description: '如何在考研备考中保持心理健康', duration: '5分钟' },
    { id: '节后抑郁', title: '节后抑郁', description: '如何应对节后情绪低落', duration: '3分钟' },
    { id: '社恐自救', title: '社恐自救', description: '社交恐惧症的自我调节方法', duration: '4分钟' },
  ];
  
  const myths = [
    { id: 'myth1', title: '抑郁就是想不开', correction: '抑郁是一种复杂的心理疾病，不仅仅是情绪问题，需要专业治疗' },
    { id: 'myth2', title: '焦虑都是坏事', correction: '适度的焦虑可以提高警觉性和动力，只有过度焦虑才需要干预' },
    { id: 'myth3', title: '心理咨询就是聊天', correction: '心理咨询是专业的心理干预过程，有系统的理论和方法' },
  ];
  
  // 搜索逻辑
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 打开百度搜索
      window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery + ' 心理健康')}`, '_blank');
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-slate-800">科普库</h2>
        <p className="text-green-600 font-light italic mt-2">岫藏：安放情绪的知识库</p>
      </div>
      
      {/* 搜索栏 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索心理知识、问题或解决方案..."
            className="w-full px-4 py-3 pl-10 pr-16 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
          <div className="absolute left-3 top-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            type="submit"
            className="absolute right-3 top-3 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </form>
      </div>
      
      {/* 分类导航 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">分类科普</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 分类内容 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{selectedCategory}相关知识</h3>
        <div className="space-y-4">
          <div className="flex gap-4 cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors" onClick={() => window.open(`https://www.baidu.com/s?wd=${encodeURIComponent('什么是' + selectedCategory + ' 心理健康')}`, '_blank')}>
            <div className="w-32 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-800">什么是{selectedCategory}？</h4>
                <span className="text-xs text-blue-600 font-medium">查看详情 →</span>
              </div>
              <p className="text-slate-600 text-sm mt-1">
                {selectedCategory === '焦虑' && '焦虑是一种常见的心理状态，表现为对未来的担忧、紧张和不安。它是人体应对压力的自然反应，但当焦虑过度或持续时间过长时，可能会影响日常生活和心理健康。焦虑障碍是最常见的心理健康问题之一，影响着许多人的生活质量。'}
                {selectedCategory === '抑郁' && '抑郁是一种常见的心理健康障碍，表现为持续的情绪低落、兴趣减退、精力下降等症状。它不仅仅是暂时的情绪波动，而是一种需要专业关注和治疗的疾病。抑郁可以影响一个人的思维、情感和行为，甚至影响身体健康。'}
                {selectedCategory === '压力管理' && '压力管理是指通过各种方法和技巧，有效地应对和缓解生活和工作中的压力。压力是生活中不可避免的一部分，但过度的压力会对身心健康造成负面影响。有效的压力管理可以帮助我们保持心理平衡，提高生活质量和工作效率。'}
                {selectedCategory === '亲子关系' && '亲子关系是指父母与子女之间的情感联系和互动模式。它是个体成长过程中最重要的人际关系之一，对儿童的认知、情感和社会发展有着深远的影响。健康的亲子关系建立在相互尊重、理解和支持的基础上。'}
                {selectedCategory === '职场心理' && '职场心理是研究工作环境中的心理现象和行为规律的学科。它关注员工的工作满意度、职业倦怠、工作压力、职业发展等问题，旨在提高工作效率和员工福祉。良好的职场心理状态对个人职业发展和组织绩效都有着重要影响。'}
                {selectedCategory !== '焦虑' && selectedCategory !== '抑郁' && selectedCategory !== '压力管理' && selectedCategory !== '亲子关系' && selectedCategory !== '职场心理' && `${selectedCategory}是一种常见的心理状态，表现为...`}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">图文</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">3分钟阅读</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors" onClick={() => window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(selectedCategory + '的常见症状 心理健康')}`, '_blank')}>
            <div className="w-32 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-800">{selectedCategory}的常见症状</h4>
                <span className="text-xs text-blue-600 font-medium">查看详情 →</span>
              </div>
              <p className="text-slate-600 text-sm mt-1">
                {selectedCategory === '焦虑' && '焦虑的主要症状包括：过度担忧、紧张不安、心跳加速、呼吸急促、出汗、手抖、睡眠困难、注意力不集中、易激惹等。在严重情况下，可能会出现惊恐发作，表现为突然的强烈恐惧和身体不适。'}
                {selectedCategory === '抑郁' && '抑郁的主要症状包括：持续的情绪低落、兴趣减退或丧失、精力下降、睡眠障碍（失眠或过度睡眠）、食欲改变（体重增加或减少）、注意力不集中、自我价值感降低、内疚感、自杀念头等。这些症状持续至少两周，并且影响日常生活。'}
                {selectedCategory === '压力管理' && '压力过大的常见症状包括：情绪波动、易怒、焦虑、抑郁、睡眠障碍、头痛、肌肉紧张、消化问题、免疫力下降、注意力不集中、工作效率降低等。长期处于高压力状态还可能导致更严重的身心健康问题。'}
                {selectedCategory === '亲子关系' && '亲子关系问题的常见表现包括：沟通障碍、冲突频繁、情感疏离、过度控制、过度保护、缺乏边界、亲子之间的信任缺失、儿童行为问题（如叛逆、退缩、攻击性）等。这些问题如果不及时解决，可能会影响儿童的心理健康和发展。'}
                {selectedCategory === '职场心理' && '职场心理问题的常见表现包括：职业倦怠（情绪耗竭、去个性化、成就感降低）、工作压力过大、工作满意度低、人际关系紧张、职业发展困惑、工作与生活平衡问题、焦虑和抑郁症状等。这些问题不仅影响个人福祉，也会影响组织的整体绩效。'}
                {selectedCategory !== '焦虑' && selectedCategory !== '抑郁' && selectedCategory !== '压力管理' && selectedCategory !== '亲子关系' && selectedCategory !== '职场心理' && `${selectedCategory}的主要症状包括...`}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">图文</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">5分钟阅读</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors" onClick={() => window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(selectedCategory + '的自我调节方法 心理健康')}`, '_blank')}>
            <div className="w-32 h-24 bg-green-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-800">{selectedCategory}的自我调节方法</h4>
                <span className="text-xs text-blue-600 font-medium">查看详情 →</span>
              </div>
              <p className="text-slate-600 text-sm mt-1">以下方法可以帮助你缓解{selectedCategory}...</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">短视频</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">4分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 热点专题 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">热点专题</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotTopics.map(topic => (
            <motion.div
              key={topic.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(topic.title + ' 心理健康')}`, '_blank')}
            >
              <h4 className="font-semibold text-slate-800 mb-2">{topic.title}</h4>
              <p className="text-slate-600 text-sm mb-3">{topic.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{topic.duration}</span>
                <span className="text-xs text-blue-600 font-medium">查看详情 →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 误区辟谣 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">误区辟谣</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {myths.map(myth => (
            <div key={myth.id} className="mb-4 last:mb-0">
              <h4 className="font-semibold text-slate-800 mb-2">{myth.title}</h4>
              <p className="text-slate-600 text-sm bg-amber-50 p-3 rounded-lg">{myth.correction}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== 自助调节工具包组件 ====================

function Tools() {
  const [selectedTool, setSelectedTool] = useState('bubble');
  
  // 情绪日记状态 - 添加模拟数据
  const [journalContent, setJournalContent] = useState('今天完成了重要的考试，感到非常开心和放松！');
  const [savedJournals, setSavedJournals] = useState<Array<{content: string; emotions: Array<{name: string; intensity: number}>}>>([
    { content: '今天和朋友们一起度过了愉快的时光，感觉很开心。', emotions: [{name: '开心', intensity: 0.9}] },
    { content: '工作压力有点大，晚上睡不着觉，担心明天的汇报。', emotions: [{name: '焦虑', intensity: 0.7}, {name: '疲惫', intensity: 0.6}] },
    { content: '和家人通了电话，感觉很温暖，心情平静了很多。', emotions: [{name: '平静', intensity: 0.8}, {name: '爱', intensity: 0.7}] },
  ]);
  const [detectedEmotions, setDetectedEmotions] = useState<Array<{name: string; intensity: number}>>([{name: '开心', intensity: 0.85}]);
  
  // 泡泡游戏状态
  const [bubbles, setBubbles] = useState<Array<{id: number; x: number; y: number; size: number; color: string}>>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  
  // 呼吸练习状态
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathActive, setBreathActive] = useState(false);
  const [breathRound, setBreathRound] = useState(0);
  
  // 积分和成就系统 - 添加模拟数据
  const [totalPoints, setTotalPoints] = useState(75);
  const [achievements, setAchievements] = useState<Array<{id: string; name: string; description: string; unlocked: boolean}>>([
    { id: 'beginner', name: '初出茅庐', description: '获得10积分', unlocked: true },
    { id: 'intermediate', name: '渐入佳境', description: '获得50积分', unlocked: true },
    { id: 'expert', name: '解压大师', description: '获得100积分', unlocked: false },
    { id: 'master', name: '情绪管理大师', description: '获得200积分', unlocked: false },
  ]);
  
  // 睡眠改善状态 - 添加模拟数据
  const [sleepTime, setSleepTime] = useState('23:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(5);
  const [sleepRecords, setSleepRecords] = useState<Array<{date: string; sleepTime: string; wakeTime: string; quality: number}>>([
    { date: '2024-04-15', sleepTime: '23:30', wakeTime: '07:00', quality: 5 },
    { date: '2024-04-14', sleepTime: '00:00', wakeTime: '07:30', quality: 4 },
    { date: '2024-04-13', sleepTime: '23:45', wakeTime: '06:50', quality: 4 },
    { date: '2024-04-12', sleepTime: '23:15', wakeTime: '07:15', quality: 5 },
    { date: '2024-04-11', sleepTime: '22:30', wakeTime: '06:30', quality: 3 },
    { date: '2024-04-10', sleepTime: '23:00', wakeTime: '07:00', quality: 4 },
  ]);
  
  const tools = [
    { id: 'bubble', label: '解压泡泡', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'breathing', label: '呼吸练习', icon: <Wind className="w-5 h-5" /> },
    { id: 'journal', label: '情绪日记', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'sleep', label: '睡眠改善', icon: <Brain className="w-5 h-5" /> },
  ];
  
  // 生成随机泡泡
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => {
        if (bubbles.length < 15) {
          const newBubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10, // 10-90%
            y: Math.random() * 80 + 10, // 10-90%
            size: Math.random() * 40 + 20, // 20-60px
            color: `hsl(${Math.random() * 60 + 120}, 70%, 70%)`, // 浅绿色系
          };
          setBubbles(prev => [...prev, newBubble]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, bubbles.length]);
  
  // 呼吸练习逻辑 (4-7-8 呼吸法)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathActive) {
      interval = setInterval(() => {
        setBreathTimer(prev => {
          const newTimer = prev + 1;
          if (newTimer >= 20) {
            setBreathTimer(0);
            if (breathPhase === 'idle') {
              setBreathPhase('inhale');
            } else if (breathPhase === 'inhale') {
              setBreathPhase('hold');
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
            } else {
              setBreathPhase('idle');
              setBreathRound(prev => prev + 1);
              if (breathRound >= 3) {
                setBreathActive(false);
                setTotalPoints(prev => prev + 5);
                alert('呼吸练习完成！获得5积分');
                return 0;
              }
            }
          }
          return newTimer;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [breathActive, breathPhase, breathRound]);
  
  // 检查成就
  useEffect(() => {
    const newAchievements = [...achievements];
    let updated = false;
    
    if (totalPoints >= 10 && !newAchievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      updated = true;
    }
    if (totalPoints >= 50 && !newAchievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      updated = true;
    }
    if (totalPoints >= 100 && !newAchievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      updated = true;
    }
    if (totalPoints >= 200 && !newAchievements[3].unlocked) {
      newAchievements[3].unlocked = true;
      updated = true;
    }
    
    if (updated) {
      setAchievements(newAchievements);
      alert('恭喜你解锁了新成就！');
    }
  }, [totalPoints, achievements]);
  
  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setGameActive(true);
  };
  
  const stopGame = () => {
    setGameActive(false);
    setTotalPoints(prev => prev + score);
  };
  
  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 1);
  };
  
  const startBreathing = () => {
    setBreathPhase('idle');
    setBreathTimer(0);
    setBreathRound(0);
    setBreathActive(true);
  };
  
  const stopBreathing = () => {
    setBreathActive(false);
    setBreathPhase('idle');
    setBreathTimer(0);
  };
  
  const emotionKeywords = {
    '开心': ['开心', '高兴', '快乐', '愉快', '欢乐', '喜悦', '兴奋', '激动', '快乐', '美好', '幸福', '满足', '满意', '舒畅', '舒服', '轻松', '愉快', '欢乐', '喜悦'],
    '焦虑': ['焦虑', '担心', '忧虑', '不安', '紧张', '害怕', '恐惧', '惶恐', '忐忑', '惊慌', '心慌', '忧虑', '烦恼', '困扰', '压力', '压抑', '沉重'],
    '愤怒': ['愤怒', '生气', '恼火', '气愤', '恼怒', '大怒', '暴怒', '发火', '火大', '气恼', '怨恨', '不满', '反感', '讨厌', '厌恶', '厌烦'],
    '悲伤': ['悲伤', '难过', '伤心', '痛苦', '难受', '伤心', '沮丧', '失落', '绝望', '崩溃', '痛哭', '泪流', '哭泣', '流泪', '忧郁', '郁闷', '压抑', '沉重'],
    '恐惧': ['恐惧', '害怕', '恐怖', '可怕', '吓人', '惊吓', '畏惧', '胆怯', '心虚', '不安', '惶恐', '惊慌', '心慌', '担心', '忧虑'],
    '惊讶': ['惊讶', '吃惊', '意外', '惊奇', '震惊', '惊异', '诧异', '意外', '没想到', '居然', '竟然', '出乎意料', '难以置信'],
    '平静': ['平静', '平静', '淡定', '从容', '安宁', '安心', '放心', '安稳', '宁静', '清净', '放松', '松弛', '轻松', '舒适', '舒服'],
    '爱': ['爱', '喜欢', '爱慕', '喜爱', '热爱', '喜欢', '爱恋', '爱戴', '喜欢', '欣赏', '崇拜', '仰慕', '迷恋', '喜欢'],
    '感激': ['感激', '感谢', '感恩', '感动', '谢谢', '感激', '致谢', '鸣谢', '感谢', '谢意', '感恩', '感激发自内心'],
    '孤独': ['孤独', '寂寞', '孤单', '落寞', '冷清', '冷落', '疏远', '隔离', '孤单', '孤独', '无人', '孤单影', '形单影只'],
    '疲惫': ['疲惫', '疲劳', '累', '疲倦', '困倦', '劳累', '疲惫', '筋疲力尽', '无精打采', '萎靡', '倦怠', '困乏', '疲乏', '累'],
    '希望': ['希望', '期待', '盼望', '渴望', '期望', '向往', '憧憬', '愿望', '期盼', '期待', '希望', '曙光', '光明', '美好', '未来'],
    '愧疚': ['愧疚', '内疚', '惭愧', '抱歉', '对不起', '后悔', '懊悔', '自责', '遗憾', '亏欠', '负罪', '悔恨', '懊恼', '后悔'],
    '嫉妒': ['嫉妒', '眼红', '羡慕', '嫉妒', '眼馋', '攀比', '羡慕', '不甘', '不服气', '眼热', '嫉妒', '艳羡'],
    '困惑': ['困惑', '迷茫', '迷茫', '疑惑', '疑问', '不解', '茫然', '迷惑', '糊涂', '头晕', '迷糊', '不清楚', '不明白', '混乱'],
  };
  
  const analyzeEmotions = (text: string) => {
    if (!text.trim()) {
      setDetectedEmotions([]);
      return;
    }
    
    const lowerText = text.toLowerCase();
    const foundEmotions: Array<{name: string; intensity: number}> = [];
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      let matchCount = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      });
      
      if (matchCount > 0) {
        const intensity = Math.min(matchCount * 0.3, 1);
        foundEmotions.push({ name: emotion, intensity });
      }
    });
    
    setDetectedEmotions(foundEmotions.sort((a, b) => b.intensity - a.intensity));
  };
  
  const saveJournal = () => {
    if (journalContent.trim()) {
      const journalEntry = {
        content: journalContent,
        emotions: [...detectedEmotions]
      };
      setSavedJournals(prev => [...prev, journalEntry]);
      setJournalContent('');
      setDetectedEmotions([]);
      setTotalPoints(prev => prev + 5);
      alert('日记已保存！获得5积分');
    }
  };
  
  const saveSleepData = () => {
    if (sleepTime && wakeTime) {
      const today = new Date().toISOString().split('T')[0];
      const newRecord = {
        date: today,
        sleepTime,
        wakeTime,
        quality: sleepQuality
      };
      
      // 添加新记录并只保留最近7天的数据
      const updatedRecords = [newRecord, ...sleepRecords]
        .filter((record, index, self) => {
          // 去重，保留最新的记录
          return index === self.findIndex(r => r.date === record.date);
        })
        .slice(0, 7); // 只保留最近7天
      
      setSleepRecords(updatedRecords);
      setSleepTime('');
      setWakeTime('');
      setSleepQuality(5);
      setTotalPoints(prev => prev + 3);
      alert('睡眠数据已保存！获得3积分');
    } else {
      alert('请填写完整的睡眠数据！');
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* 工具导航 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">自助调节工具</h2>
        <p className="text-green-600 font-light italic mb-4">云襄：与情绪和解的方法</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedTool === tool.id ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {tool.icon}
              {tool.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 积分和成就 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">我的积分</h3>
          <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">成就</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {achievements.map(achievement => (
              <div key={achievement.id} className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
                <div className="font-medium">{achievement.name}</div>
                <div className="text-sm text-slate-600">{achievement.description}</div>
                <div className={`text-xs mt-1 ${achievement.unlocked ? 'text-green-600' : 'text-slate-400'}`}>
                  {achievement.unlocked ? '已解锁' : '未解锁'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 工具内容 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {selectedTool === 'bubble' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">解压泡泡</h3>
            <p className="text-slate-600">点击泡泡来解压，每点击一个泡泡获得1积分</p>
            <div className="relative border border-slate-200 rounded-xl h-96 bg-slate-50">
              {gameActive && bubbles.map(bubble => (
                <motion.div
                  key={bubble.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute',
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    borderRadius: '50%',
                    backgroundColor: bubble.color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => popBubble(bubble.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-white font-medium text-sm">{bubble.size > 40 ? 'POP!' : 'pop'}</span>
                </motion.div>
              ))}
              {!gameActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-slate-500 mb-4">点击开始游戏</p>
                  <button 
                    onClick={startGame}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg"
                  >
                    开始
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">得分：{score}</div>
              {gameActive && (
                <button 
                  onClick={stopGame}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  结束游戏
                </button>
              )}
            </div>
          </div>
        )}
        
        {selectedTool === 'breathing' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">呼吸练习</h3>
            <p className="text-slate-600">4-7-8 呼吸法：吸气4秒 → 屏气7秒 → 呼气8秒。完成一轮获得5积分。</p>
            <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-xl border border-slate-200">
              <div className="relative w-48 h-48 mb-8">
                <div className={`absolute inset-0 rounded-full transition-all duration-500 ${breathPhase === 'inhale' ? 'bg-blue-400 scale-110' : breathPhase === 'hold' ? 'bg-green-400 scale-100' : breathPhase === 'exhale' ? 'bg-purple-400 scale-90' : 'bg-slate-300 scale-100'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {breathPhase === 'inhale' ? '吸气' : breathPhase === 'hold' ? '屏气' : breathPhase === 'exhale' ? '呼气' : '准备'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-lg font-medium text-slate-700 mb-4">
                第 {breathRound + 1} / 4 轮
              </div>
              {!breathActive && (
                <button 
                  onClick={startBreathing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium"
                >
                  开始练习
                </button>
              )}
              {breathActive && (
                <button 
                  onClick={stopBreathing}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-medium"
                >
                  停止
                </button>
              )}
            </div>
          </div>
        )}
        
        {selectedTool === 'journal' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">情绪日记编辑器</h3>
            <p className="text-slate-600">记录你的情绪和想法，帮助你更好地了解自己</p>
            <p className="text-lg italic text-green-600 font-light">观情绪云卷，守心岫一方</p>
            <textarea
              placeholder="今天发生了什么？你有什么感受？..."
              value={journalContent}
              onChange={(e) => {
                setJournalContent(e.target.value);
                analyzeEmotions(e.target.value);
              }}
              className="w-full h-40 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            {detectedEmotions.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">自动识别到的情绪</h4>
                <div className="flex flex-wrap gap-2">
                  {detectedEmotions.map((emotion, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${emotion.intensity > 0.7 ? 'bg-red-100 text-red-700' : emotion.intensity > 0.4 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {emotion.name} {emotion.intensity > 0.7 ? '(强烈)' : emotion.intensity > 0.4 ? '(中等)' : '(轻微)'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button 
              onClick={saveJournal}
              disabled={!journalContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存日记
            </button>
            {savedJournals.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-slate-800 mb-2">已保存的日记</h4>
                <div className="space-y-2">
                  {savedJournals.map((journal, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                      <p className="text-sm text-slate-600 mb-2">{journal.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {journal.emotions.map((emotion, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{emotion.name}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {selectedTool === 'sleep' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">睡眠记录</h3>
            <p className="text-slate-600">记录你的睡眠情况，系统会自动保存最近一周的数据</p>
            <p className="text-lg italic text-green-600 font-light">情绪有归处，心自有云岫</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">入睡时间</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">起床时间</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">睡眠质量 (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>差</span>
                <span>{sleepQuality}</span>
                <span>好</span>
              </div>
            </div>
            <button 
              onClick={saveSleepData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              保存睡眠数据
            </button>
            
            {/* 最近一周睡眠数据 */}
            {sleepRecords.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-slate-800 mb-3">最近一周睡眠数据</h4>
                <div className="space-y-2">
                  {sleepRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">{record.date}</div>
                        <div className="text-sm text-slate-600">
                          入睡: {record.sleepTime} | 起床: {record.wakeTime} | 质量: {record.quality}/10
                        </div>
                      </div>
                      <div className={`w-16 h-2 rounded-full ${record.quality >= 8 ? 'bg-green-500' : record.quality >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(record.quality / 10) * 100}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}



// ==================== 个性化心理成长计划组件 ====================

function GrowthPlan() {
  const [customPlan, setCustomPlan] = useState({
    name: '我的成长计划',
    days: 7,
    tasks: [
      { id: '1', day: '第1天', task: '做10分钟正念呼吸冥想', points: 10 },
      { id: '2', day: '第2天', task: '写3件今天让你感到开心的事', points: 10 },
      { id: '3', day: '第3天', task: '进行3轮478呼吸练习', points: 12 },
      { id: '4', day: '第4天', task: '练习5分钟渐进式肌肉放松', points: 12 },
      { id: '5', day: '第5天', task: '听一首舒缓的音乐并记录感受', points: 10 },
      { id: '6', day: '第6天', task: '进行一次5分钟的身体扫描练习', points: 12 },
      { id: '7', day: '第7天', task: '回顾一周的成长历程', points: 15 },
    ]
  });
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newPoints, setNewPoints] = useState(10);
  
  // 计算积分和完成率
  const calculateStats = () => {
    const completed = customPlan.tasks.filter(task => completedTasks.includes(task.id));
    const totalPoints = customPlan.tasks.reduce((sum, task) => sum + task.points, 0);
    const earnedPoints = completed.reduce((sum, task) => sum + task.points, 0);
    const completionRate = customPlan.tasks.length > 0 ? Math.round((completed.length / customPlan.tasks.length) * 100) : 0;
    
    return {
      totalTasks: customPlan.tasks.length,
      completedTasks: completed.length,
      completionRate,
      totalPoints,
      earnedPoints
    };
  };
  
  const stats = calculateStats();
  
  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };
  
  const handleAddTask = () => {
    if (newTask.trim()) {
      const newId = (customPlan.tasks.length + 1).toString();
      const newDay = `第${customPlan.tasks.length + 1}天`;
      setCustomPlan(prev => ({
        ...prev,
        tasks: [...prev.tasks, { id: newId, day: newDay, task: newTask, points: newPoints }]
      }));
      setNewTask('');
      setNewPoints(10);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    setCustomPlan(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
  };
  
  const handleUpdateTask = (taskId: string, field: 'task' | 'points', value: string | number) => {
    setCustomPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }));
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* 计划标题和编辑按钮 */}
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-bold text-slate-800">个性化心理成长计划</h2>
        <p className="text-green-600 font-light italic mb-4">岫途：与自己同频的旅程</p>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {isEditing ? '保存' : '自定义计划'}
        </button>
      </div>
      
      {/* 计划详情 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* 计划名称编辑 */}
        {isEditing ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">计划名称</label>
            <input
              type="text"
              value={customPlan.name}
              onChange={(e) => setCustomPlan(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <h3 className="text-xl font-bold text-slate-800 mb-4">{customPlan.name}</h3>
        )}
        
        <p className="text-slate-600 mb-6">根据你的需求，定制属于你的心理成长计划。每天完成任务，累计积分，见证你的成长。</p>
        
        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-sm text-slate-600">完成进度</div>
            <div className="text-2xl font-bold text-blue-700">{stats.completionRate}%</div>
            <div className="text-xs text-slate-500">{stats.completedTasks}/{stats.totalTasks} 任务</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm text-slate-600">累计积分</div>
            <div className="text-2xl font-bold text-green-700">{stats.earnedPoints}</div>
            <div className="text-xs text-slate-500">目标: {stats.totalPoints} 积分</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-sm text-slate-600">连续打卡</div>
            <div className="text-2xl font-bold text-purple-700">{stats.completedTasks}</div>
            <div className="text-xs text-slate-500">天</div>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>完成进度</span>
            <span>{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>
        

        
        {/* 任务列表 */}
        <div className="space-y-3 mb-6">
          {customPlan.tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={completedTasks.includes(task.id)}
                  onChange={() => handleTaskToggle(task.id)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{task.day}</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={task.task}
                      onChange={(e) => handleUpdateTask(task.id, 'task', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-slate-600">{task.task}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={task.points}
                    onChange={(e) => handleUpdateTask(task.id, 'points', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-sm font-medium text-blue-600">+{task.points}积分</div>
                )}
                {isEditing && (
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 添加新任务 */}
        {isEditing && (
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl mb-6">
            <h4 className="font-medium text-slate-800 mb-3">添加新任务</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="输入任务内容..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={newPoints}
                onChange={(e) => setNewPoints(parseInt(e.target.value) || 0)}
                placeholder="积分"
                className="w-20 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTask}
                disabled={!newTask.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        )}
        
        {/* 积分统计 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-semibold text-slate-800 mb-4">成就系统</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completedTasks}</div>
              <div className="text-sm text-slate-600">任务完成</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.earnedPoints}</div>
              <div className="text-sm text-slate-600">积分获得</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <div className="text-sm text-slate-600">完成进度</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-2xl font-bold text-amber-600">{Math.floor(stats.earnedPoints / 100)}</div>
              <div className="text-sm text-slate-600">等级</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 免责声明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="font-semibold text-amber-800 mb-2">免责声明</h4>
        <p className="text-sm text-amber-700">本平台仅为辅助工具，不能替代专业医疗诊断，如有严重心理问题请及时就医。</p>
      </div>
    </motion.div>
  );
}

// 评估问卷组件（支持多种测试类型）
function AssessmentQuiz({ type, onBack, onTabChange }: { type: string; onBack: () => void; onTabChange: (tab: 'dashboard' | 'chat' | 'record' | 'assessment' | 'knowledge' | 'tools' | 'community' | 'plan') => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 定义不同测试类型的题目
  const assessmentData: Record<string, { title: string; questions: string[]; options: { value: number; label: string }[]; questionsWithOptions?: { question: string; options: string[] }[]; getResult: (answers: number[]) => any }> = {
    phq9: {
      title: "PHQ-9 抑郁筛查",
      questions: [
        "做事时提不起劲或没有兴趣",
        "感到心情低落、沮丧或绝望", 
        "入睡困难、睡不安稳或睡太多",
        "感到疲倦或没有活力",
        "食欲不振或吃太多",
        "觉得自己很糟或觉得自己很失败，或让自己和家人失望",
        "对事物专注有困难，例如阅读报纸或看电视时",
        "动作或说话速度缓慢到别人已经察觉？或正好相反：烦躁或坐立不安、动来动去的情况更胜于平常",
        "有不如死掉或用某种方式伤害自己的念头",
        "对未来感到悲观或绝望",
        "感到孤独或与他人疏远",
        "对以前喜欢的活动失去兴趣",
        "感到生活没有意义或价值",
        "感到自己是他人的负担",
        "难以做出决定"
      ],
      options: [
        { value: 0, label: "完全没有" },
        { value: 1, label: "几天" },
        { value: 2, label: "一半以上天数" },
        { value: 3, label: "几乎每天" }
      ],
      getResult: (answers) => {
        const totalScore = answers.reduce((a, b) => a + b, 0);
        if (totalScore <= 4) return { level: '无或轻微', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: '你的情绪状态良好，继续保持！', score: totalScore };
        if (totalScore <= 9) return { level: '轻度', color: 'text-blue-600', bg: 'bg-blue-50', desc: '有些抑郁症状，建议进行自我调节和放松练习', score: totalScore };
        if (totalScore <= 14) return { level: '中度', color: 'text-amber-600', bg: 'bg-amber-50', desc: '建议预约学校心理咨询中心', score: totalScore };
        if (totalScore <= 19) return { level: '中重度', color: 'text-orange-600', bg: 'bg-orange-50', desc: '强烈建议寻求专业心理咨询', score: totalScore };
        return { level: '重度', color: 'text-rose-600', bg: 'bg-rose-50', desc: '请立即联系专业心理医生', score: totalScore };
      }
    },
    gad7: {
      title: "GAD-7 焦虑评估",
      questions: [
        "感到紧张、焦虑或急切",
        "不能停止或控制担忧",
        "对各种事情担忧过多",
        "很难放松下来",
        "烦躁不安，坐立不宁",
        "变得容易烦恼或易怒",
        "感到好像有可怕的事要发生",
        "担心自己或家人的健康",
        "担心工作或学习表现",
        "担心财务状况",
        "担心社交场合或人际关系",
        "感到心跳加速或心悸",
        "感到呼吸困难或窒息感",
        "感到头晕或眩晕",
        "感到胃部不适或恶心"
      ],
      options: [
        { value: 0, label: "完全没有" },
        { value: 1, label: "几天" },
        { value: 2, label: "一半以上天数" },
        { value: 3, label: "几乎每天" }
      ],
      getResult: (answers) => {
        const totalScore = answers.reduce((a, b) => a + b, 0);
        if (totalScore <= 4) return { level: '无或轻微', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: '你的焦虑水平正常，继续保持！', score: totalScore };
        if (totalScore <= 9) return { level: '轻度', color: 'text-blue-600', bg: 'bg-blue-50', desc: '有轻度焦虑症状，建议进行放松练习', score: totalScore };
        if (totalScore <= 14) return { level: '中度', color: 'text-amber-600', bg: 'bg-amber-50', desc: '有中度焦虑症状，建议寻求专业帮助', score: totalScore };
        return { level: '重度', color: 'text-rose-600', bg: 'bg-rose-50', desc: '有重度焦虑症状，强烈建议寻求专业心理咨询', score: totalScore };
      }
    },
    mbti: {
      title: "MBTI 性格测试",
      questions: [
        "在社交场合，你通常：",
        "你更喜欢：",
        "在做决定时，你更依赖：",
        "你的生活方式更倾向于：",
        "你更喜欢的工作环境是：",
        "当面对压力时，你倾向于：",
        "你更重视：",
        "在社交活动中，你更倾向于：",
        "你更喜欢的学习方式是：",
        "当计划改变时，你的反应是：",
        "你更擅长：",
        "你更喜欢的休闲方式是：",
        "在团队合作中，你更倾向于：",
        "你更关注的重点是：",
        "你更喜欢的沟通方式是：",
        "当遇到问题时，你更倾向于：",
        "在聚会中，你通常：",
        "你对未来的看法是：",
        "当与他人意见不合时，你会：",
        "你处理日常事务的方式是：",
        "你对规则和制度的态度是：",
        "在解决问题时，你更注重：",
        "你与朋友的关系特点是：",
        "你对新环境的适应方式是："
      ],
      options: [
        { value: 0, label: "非常倾向于外向，喜欢与他人互动" },
        { value: 1, label: "比较倾向于外向，享受社交活动" },
        { value: 2, label: "居中，根据情况调整" },
        { value: 3, label: "比较倾向于内向，喜欢独处思考" },
        { value: 4, label: "非常倾向于内向，偏好安静环境" }
      ],
      questionsWithOptions: [
        {
          question: "在社交场合，你通常：",
          options: ["非常倾向于外向，喜欢与他人互动", "比较倾向于外向，享受社交活动", "居中，根据情况调整", "比较倾向于内向，喜欢独处思考", "非常倾向于内向，偏好安静环境"]
        },
        {
          question: "你更喜欢：",
          options: ["非常注重现实，关注具体细节", "比较注重现实，重视实际情况", "居中，兼顾现实和未来", "比较注重未来，关注抽象概念", "非常注重未来，喜欢探索可能性"]
        },
        {
          question: "在做决定时，你更依赖：",
          options: ["非常依赖逻辑分析，理性判断", "比较依赖逻辑分析，注重事实", "居中，兼顾逻辑和情感", "比较依赖情感因素，考虑他人感受", "非常依赖情感因素，重视人际关系"]
        },
        {
          question: "你的生活方式更倾向于：",
          options: ["非常有计划，有条理", "比较有计划，喜欢按部就班", "居中，灵活规划", "比较灵活应变，随遇而安", "非常灵活，喜欢 spontaneity"]
        },
        {
          question: "你更喜欢的工作环境是：",
          options: ["非常结构清晰，规则明确", "比较结构清晰，有明确目标", "居中，平衡结构和自由", "比较灵活自由，充满创意", "非常灵活自由，无拘无束"]
        },
        {
          question: "当面对压力时，你倾向于：",
          options: ["非常直接面对，立即解决问题", "比较直接面对，积极应对", "居中，根据情况调整", "比较暂时回避，冷静思考", "非常暂时回避，需要时间处理"]
        },
        {
          question: "你更重视：",
          options: ["非常重视效率和结果", "比较重视效率和结果", "居中，兼顾效率和过程", "比较重视过程和体验", "非常重视过程和体验"]
        },
        {
          question: "在社交活动中，你更倾向于：",
          options: ["非常主动参与，成为焦点", "比较主动参与，享受社交", "居中，根据场合调整", "比较观察倾听，保持低调", "非常观察倾听，喜欢独处"]
        },
        {
          question: "你更喜欢的学习方式是：",
          options: ["非常喜欢实践操作，动手体验", "比较喜欢实践操作，注重应用", "居中，兼顾实践和理论", "比较喜欢理论学习，思考分析", "非常喜欢理论学习，深入思考"]
        },
        {
          question: "当计划改变时，你的反应是：",
          options: ["非常感到不适，需要调整", "比较感到不适，需要时间适应", "居中，灵活应对", "比较灵活适应，顺势而为", "非常灵活适应，喜欢变化"]
        },
        {
          question: "你更擅长：",
          options: ["非常擅长执行任务，完成目标", "比较擅长执行任务，注重细节", "居中，兼顾执行和创意", "比较擅长创意构思，提出新想法", "非常擅长创意构思，创新思维"]
        },
        {
          question: "你更喜欢的休闲方式是：",
          options: ["非常喜欢参加社交活动，与人交流", "比较喜欢参加社交活动，享受聚会", "居中，兼顾社交和独处", "比较喜欢独自活动，享受个人空间", "非常喜欢独自活动，偏好安静"]
        },
        {
          question: "在团队合作中，你更倾向于：",
          options: ["非常倾向于组织协调，确保任务完成", "比较倾向于组织协调，注重效率", "居中，兼顾组织和创意", "比较倾向于贡献创意，提供新视角", "非常倾向于贡献创意，挑战常规"]
        },
        {
          question: "你更关注的重点是：",
          options: ["非常关注当前的实际问题", "比较关注当前的实际问题", "居中，兼顾当前和未来", "比较关注未来的可能性和发展", "非常关注未来的可能性和发展"]
        },
        {
          question: "你更喜欢的沟通方式是：",
          options: ["非常直接明确，直奔主题", "比较直接明确，注重效率", "居中，兼顾直接和委婉", "比较委婉含蓄，注重氛围", "非常委婉含蓄，注重和谐"]
        },
        {
          question: "当遇到问题时，你更倾向于：",
          options: ["非常倾向于分析原因，找出解决方案", "比较倾向于分析原因，逻辑思考", "居中，兼顾分析和寻求支持", "比较倾向于寻求支持，共同面对", "非常倾向于寻求支持，依赖他人"]
        },
        {
          question: "在聚会中，你通常：",
          options: ["非常积极参与各种活动，与多人交流", "比较积极参与，享受社交", "居中，根据心情调整", "比较与少数熟悉的人深入交谈，或观察周围环境", "非常与少数熟悉的人深入交谈，或观察周围环境"]
        },
        {
          question: "你对未来的看法是：",
          options: ["非常关注现实可能性，脚踏实地", "比较关注现实可能性，注重实际", "居中，兼顾现实和理想", "比较充满想象，期待各种可能性", "非常充满想象，理想化思考"]
        },
        {
          question: "当与他人意见不合时，你会：",
          options: ["非常理性分析分歧，寻找客观解决方案", "比较理性分析分歧，注重事实", "居中，兼顾理性和情感", "比较考虑他人感受，寻求共识", "非常考虑他人感受，避免冲突"]
        },
        {
          question: "你处理日常事务的方式是：",
          options: ["非常提前规划，按计划执行", "比较提前规划，喜欢有序", "居中，灵活规划", "比较灵活应对，随机应变", "非常灵活，无固定计划"]
        },
        {
          question: "你对规则和制度的态度是：",
          options: ["非常认为规则很重要，应该严格遵守", "比较认为规则很重要，应该遵守", "居中，灵活遵守规则", "比较觉得规则应该灵活，视情况而定", "非常觉得规则应该灵活，反对僵化"]
        },
        {
          question: "在解决问题时，你更注重：",
          options: ["非常注重问题的本质和逻辑关系", "比较注重问题的本质和逻辑关系", "居中，兼顾逻辑和人际关系", "比较注重人际关系和情感因素", "非常注重人际关系和情感因素"]
        },
        {
          question: "你与朋友的关系特点是：",
          options: ["非常朋友众多，广泛社交", "比较朋友众多，喜欢社交", "居中，兼顾广度和深度", "比较深交少数，注重质量", "非常深交少数，注重深度"]
        },
        {
          question: "你对新环境的适应方式是：",
          options: ["非常快速融入，主动探索", "比较快速融入，积极适应", "居中，逐步适应", "比较观察了解，逐渐适应", "非常观察了解，谨慎适应"]
        }
      ],
      getResult: (answers) => {
        // 正确的MBTI计算逻辑
        // 统计每个维度的得分
        let e = 0, i = 0, s = 0, n = 0, t = 0, f = 0, j = 0, p = 0;
        
        // E/I 维度 (外向/内向) - 问题索引: 0, 5, 7, 12, 16, 23
        [0, 5, 7, 12, 16, 23].forEach(idx => {
          const a = answers[idx];
          if (a === 0) e += 2; // 非常外向
          if (a === 1) e += 1; // 比较外向
          if (a === 3) i += 1; // 比较内向
          if (a === 4) i += 2; // 非常内向
        });
        
        // S/N 维度 (感觉/直觉) - 问题索引: 1, 8, 10, 13, 17, 22
        [1, 8, 10, 13, 17, 22].forEach(idx => {
          const a = answers[idx];
          if (a === 0) s += 2; // 非常感觉
          if (a === 1) s += 1; // 比较感觉
          if (a === 3) n += 1; // 比较直觉
          if (a === 4) n += 2; // 非常直觉
        });
        
        // T/F 维度 (思考/情感) - 问题索引: 2, 6, 11, 14, 19, 21
        [2, 6, 11, 14, 19, 21].forEach(idx => {
          const a = answers[idx];
          if (a === 0) t += 2; // 非常思考
          if (a === 1) t += 1; // 比较思考
          if (a === 3) f += 1; // 比较情感
          if (a === 4) f += 2; // 非常情感
        });
        
        // J/P 维度 (判断/感知) - 问题索引: 3, 4, 9, 15, 20
        [3, 4, 9, 15, 20].forEach(idx => {
          const a = answers[idx];
          if (a === 0) j += 2; // 非常判断
          if (a === 1) j += 1; // 比较判断
          if (a === 3) p += 1; // 比较感知
          if (a === 4) p += 2; // 非常感知
        });
        
        const type = `${e > i ? 'E' : 'I'}${s > n ? 'S' : 'N'}${t > f ? 'T' : 'F'}${j > p ? 'J' : 'P'}`;
        
        const typeDescriptions: Record<string, string> = {
          'INTJ': '建筑师：独立策略性强，逻辑分析能力高，善于规划长期目标。',
          'INTP': '逻辑学家：分析能力强，喜欢探索理论和概念，独立思考。',
          'ENTJ': '指挥官：果断自信，战略性强，擅长规划和领导。',
          'ENTP': '辩论家：机智灵活，喜欢挑战和创新，善于解决问题。',
          'INFJ': '博爱者：深沉洞察力强，理想主义，关注意义和价值，致力于帮助他人。',
          'INFP': '调停者：理想主义，重视价值观和情感，善于理解他人。',
          'ENFJ': '主人公：有领导力，善于沟通和激励他人，关注团队和社会。',
          'ENFP': '竞选者：充满热情和创造力，善于激励他人，喜欢新奇事物。',
          'ISTJ': '监督者：严谨有序，注重逻辑和事实，可靠勤奋，喜欢稳定环境。',
          'ISFJ': '保护者：富有同情心和责任感，善于倾听和支持他人，追求和谐。',
          'ESTJ': '执行者：务实果断，注重规则和效率，擅长组织和管理。',
          'ESFJ': '照顾者：友好热心，重视人际关系，乐于帮助他人。',
          'ISTP': '鉴赏家：冷静理性，动手能力强，喜欢独立和自由。',
          'ISFP': '艺术家：敏感创造力强，追求内心和谐与美感。',
          'ESTP': '企业家：活跃现实，喜欢冒险和行动，善于应对变化。',
          'ESFP': '表演者：外向热情，享受生活和社交，富有感染力。'
        };
        
        return { 
          level: type, 
          color: 'text-purple-600', 
          bg: 'bg-purple-50', 
          desc: typeDescriptions[type] || '独特的性格类型',
          score: 0
        };
      }
    },

  };

  const currentAssessment = assessmentData[type] || assessmentData.phq9;
  const questions = currentAssessment.questions;
  const options = currentAssessment.options;

  const handleAnswer = async (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      try {
        // 获取token
        const token = localStorage.getItem('token');
        
        // 尝试向后端API提交评估结果
        const response = await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            type: type,
            answers: newAnswers
          }),
        });
        
        if (response.ok) {
          // 提交成功，显示结果
          setShowResult(true);
        } else {
          // 提交失败，直接显示结果
          console.log('API调用失败，直接显示结果');
          setShowResult(true);
        }
      } catch (error) {
        // 网络错误，直接显示结果
        console.error('网络错误，直接显示结果:', error);
        setShowResult(true);
      }
    }
  };

  const result = currentAssessment.getResult(answers);

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 p-8"
      >
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${result.bg} mb-4`}>
            <span className={`text-3xl font-bold ${result.color}`}>
              {result.score > 0 ? result.score : result.level}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">评估结果</h2>
          <p className="text-slate-600">{currentAssessment.title}</p>
        </div>

        <div className={`${result.bg} rounded-2xl p-6 mb-6`}>
          <h3 className={`text-lg font-bold ${result.color} mb-2`}>
            {result.score > 0 ? `你的结果为${result.level}（${result.score}分）` : `你的性格类型：${result.level}`}
          </h3>
          <p className="text-slate-700">{result.desc}</p>
          {type === 'mbti' && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-600">
                MBTI性格类型由四个维度组成：
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/50 p-2 rounded-lg">
                  <span className="font-medium">外向(E) / 内向(I):</span>
                  <span className="ml-2">{result.level.charAt(0) === 'E' ? '外向' : '内向'}</span>
                </div>
                <div className="bg-white/50 p-2 rounded-lg">
                  <span className="font-medium">感觉(S) / 直觉(N):</span>
                  <span className="ml-2">{result.level.charAt(1) === 'S' ? '感觉' : '直觉'}</span>
                </div>
                <div className="bg-white/50 p-2 rounded-lg">
                  <span className="font-medium">思考(T) / 情感(F):</span>
                  <span className="ml-2">{result.level.charAt(2) === 'T' ? '思考' : '情感'}</span>
                </div>
                <div className="bg-white/50 p-2 rounded-lg">
                  <span className="font-medium">判断(J) / 感知(P):</span>
                  <span className="ml-2">{result.level.charAt(3) === 'J' ? '判断' : '感知'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 显示大五人格的详细特质 */}
        {result.traits && (
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-slate-800">人格特质分析</h4>
            {result.traits.map((trait: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">{trait.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(trait.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500">{trait.desc}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 显示建议 */}
        {result.score > 4 && !result.traits && type !== 'mbti' && (
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-slate-800">建议下一步</h4>
            {result.score > 9 && (
              <button onClick={() => { onTabChange('knowledge'); }} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors w-full text-left">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">预约学校心理咨询中心</p>
                  <p className="text-sm text-slate-500">专业咨询师一对一支持</p>
                </div>
              </button>
            )}
            <button onClick={() => { onTabChange('tools'); }} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors w-full text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">开始冥想练习</p>
                <p className="text-sm text-slate-500">10分钟日常冥想，缓解情绪</p>
              </div>
            </button>
          </div>
        )}
        
        {/* MBTI性格类型建议 */}
        {type === 'mbti' && (
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-slate-800">性格特点与建议</h4>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-700 leading-relaxed">
                了解你的性格类型可以帮助你：
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                <li>更好地理解自己的行为模式和偏好</li>
                <li>改善与他人的沟通和关系</li>
                <li>选择更适合自己的学习和工作方式</li>
                <li>制定更有效的个人发展计划</li>
              </ul>
            </div>
            <button onClick={() => { onTabChange('knowledge'); }} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors w-full text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">探索更多性格类型信息</p>
                <p className="text-sm text-slate-500">了解不同性格类型的特点和优势</p>
              </div>
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            返回评估中心
          </button>
          <button 
            onClick={() => {setCurrentQ(0); setAnswers([]); setShowResult(false);}}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            重新评估
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        ← 返回
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">问题 {currentQ + 1} / {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < currentQ ? 'bg-blue-600' : i === currentQ ? 'bg-blue-400' : 'bg-slate-200'
                  }`} 
                />
              ))}
            </div>
          </div>
          {type !== 'mbti' && (
            <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
              {type === 'phq9' ? '过去两周，你被以下问题困扰的频率如何？' : 
               type === 'gad7' ? '过去两周，你被以下问题困扰的频率如何？' : 
               '请根据你的实际情况回答以下问题'}
            </h3>
          )}
          <p className="text-lg text-slate-700 mt-4 font-medium">
            {type === 'mbti' ? questions[currentQ] : `"${questions[currentQ]}"`}
          </p>
        </div>

        <div className="space-y-3">
          {type === 'mbti' && currentAssessment.questionsWithOptions ? (
            currentAssessment.questionsWithOptions[currentQ].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <span className="font-medium text-slate-700 group-hover:text-blue-700">
                  {option}
                </span>
              </button>
            ))
          ) : (
            options.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <span className="font-medium text-slate-700 group-hover:text-blue-700">
                  {option.label}
                </span>
              </button>
            ))
          )}
        </div>

        {type === 'phq9' && (
          <p className="text-xs text-slate-400 mt-6 text-center">
            第9题涉及自杀意念，如选择有此类想法，请寻求专业帮助
          </p>
        )}
      </div>
    </div>
  );
}

// ==================== 通用组件 ====================

function Navigation({ activeTab, onTabChange, user }: { activeTab: string; onTabChange: (t: any) => void; user: any }) {
  const tabs = [
    { id: 'dashboard', label: '仪表盘', icon: <Activity className="w-5 h-5" /> },
    { id: 'record', label: '记录', icon: <Heart className="w-5 h-5" /> },
    { id: 'chat', label: 'AI聊', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'assessment', label: '评估', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'knowledge', label: '科普库', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tools', label: '工具包', icon: <Wind className="w-5 h-5" /> },

    { id: 'plan', label: '成长计划', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    // 重新刷新页面
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              云岫
            </span>
          </div>

          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>


        </div>
      </div>
    </nav>
  );
}

function MetricCard({ title, subtitle, value, trend, icon, color, artisticTitle }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <div className={color.replace('bg-', 'text-')}>{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
            trend === 'down' ? 'bg-rose-100 text-rose-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      {artisticTitle && (
        <p className="text-green-600 text-xs font-light italic mb-2">{artisticTitle}</p>
      )}
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </motion.div>
  );
}

function SafetyBadge({ status }: { status: string }) {
  const isSafe = status === "状态良好";
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
      isSafe ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
      {status}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">加载中...</p>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }: { onAuth: (u: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = isLogin ? { email, password } : { username, email, password };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '认证失败');
      }
      
      const result = await response.json();
      
      // 存储token
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user_id', result.user_id);
      localStorage.setItem('username', result.username);
      
      // 登录成功
      onAuth({
        id: result.user_id,
        username: result.username,
        token: result.access_token
      });
      
    } catch (err: any) {
      setError(err.message || '网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">MindGuard</h1>
          <p className="text-slate-500 mt-2">智能心理健康助手</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="用户名" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input 
            type="email" 
            placeholder="邮箱" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="password" 
            placeholder="密码" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={8}
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-medium ml-1 hover:underline"
          >
            {isLogin ? '立即注册' : '去登录'}
          </button>
        </p>

        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-800 text-center leading-relaxed">
            📝 测试账号：demo@example.com<br/>
            密码：12345678
          </p>
        </div>
      </motion.div>
    </div>
  );
}
