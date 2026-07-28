import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export type ContentType = 'text' | 'micro_lesson' | 'exercise' | 'feedback';

export interface TutorMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  contentType: ContentType;
}

export function useTutor() {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0.5);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  const startSession = async (subject: string, topic: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('tutor_sessions')
        .insert({
          user_id: userData.user.id,
          subject,
          topic,
          education_level: 'GCE O Level', // Default or fetch from profile
          performance_score: 0.5,
          total_messages: 0
        })
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setCurrentSubject(subject);
      setMessages([]);
      setPerformanceScore(0.5);
      
      // Start initial conversation
      await sendMessage("Hello! Let's start the lesson on " + topic, data.id, subject);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  const parseGeminiStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, onChunk: (text: string) => void) => {
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        // Server-Sent Events parsing
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.candidates && data.candidates[0].content.parts[0].text) {
                onChunk(data.candidates[0].content.parts[0].text);
              }
            } catch (e) {
              // Ignore incomplete JSON
            }
          }
        }
      }
    }
  };

  const sendMessage = async (text: string, overrideSessionId?: string, overrideSubject?: string) => {
    const activeSessionId = overrideSessionId || sessionId;
    const activeSubject = overrideSubject || currentSubject;

    if (!activeSessionId) return;

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      contentType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: text,
          subject: activeSubject,
          educationLevel: 'GCE O Level',
          performanceScore,
          history
        })
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let fullResponse = '';

      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMessageId, role: 'model', content: '', contentType: 'text' }]);

      await parseGeminiStream(reader, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId ? { ...m, content: fullResponse } : m
        ));
      });

      // Simple parsing logic for markers
      // In a real scenario we'd split the response into multiple messages based on [LESSON], [EXERCISE], [FEEDBACK]
      // For this example, let's update the contentType if it contains those markers
      setMessages(prev => prev.map(m => {
        if (m.id === aiMessageId) {
          let cType: ContentType = 'text';
          if (m.content.includes('[LESSON]')) cType = 'micro_lesson';
          if (m.content.includes('[EXERCISE]')) cType = 'exercise';
          if (m.content.includes('[FEEDBACK]')) cType = 'feedback';
          return { ...m, contentType: cType };
        }
        return m;
      }));

      // Update total_messages count in Supabase
      await supabase.rpc('increment_tutor_messages', { session_id_param: activeSessionId });

    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsStreaming(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    // Send user answer and get feedback
    // Update performance score based on some heuristic or let AI grade it
    // For now we just send it as a message
    await sendMessage(`My answer to the exercise is: ${answer}`);
    
    // Naively adjust performance score just to show it changes
    setPerformanceScore(prev => Math.min(1, prev + 0.1));
  };

  const playAudio = async (text: string) => {
    try {
      const res = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Failed to fetch audio");
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  return {
    messages,
    isStreaming,
    performanceScore,
    sessionId,
    currentSubject,
    startSession,
    sendMessage,
    submitAnswer,
    playAudio
  };
}
