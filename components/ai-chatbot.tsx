"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"
import { ChatbotAI, type ChatMessage, type ChatbotContext } from "@/lib/chatbot-ai"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { usePathname } from "next/navigation"

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { user } = useAuth()
  const { language, t } = useLanguage()
  const pathname = usePathname()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatbotRef = useRef<ChatbotAI | null>(null)

  // Initialize chatbot AI
  useEffect(() => {
    const context: ChatbotContext = {
      userRole: user?.role || "guest",
      currentPage: pathname,
      language,
    }

    chatbotRef.current = new ChatbotAI(context)

    // Add initial greeting message
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: `msg_${Date.now()}`,
        text: chatbotRef.current.getContextualGreeting(),
        isUser: false,
        timestamp: new Date(),
        language,
      }
      setMessages([greeting])
    }
  }, [user, language, pathname])

  // Update context when user or page changes
  useEffect(() => {
    if (chatbotRef.current) {
      chatbotRef.current.updateContext({
        userRole: user?.role || "guest",
        currentPage: pathname,
        language,
      })
    }
  }, [user, pathname, language])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatbotRef.current) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      language,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse = chatbotRef.current!.generateResponse(inputValue)
        const aiMessage: ChatMessage = {
          id: `msg_${Date.now()}_ai`,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
          language,
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // 1-2 seconds delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 shadow-xl transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-sm font-medium">TakeSurvey AI Assistant</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col p-0" style={{ height: "calc(500px - 60px)" }}>
          <ScrollArea className="flex-1 px-4 py-2" style={{ height: "calc(100% - 80px)" }}>
            <div className="space-y-4 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.isUser ? "justify-end" : "justify-start"}`}>
                  {!message.isUser && (
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[calc(100%-3rem)] min-w-0 rounded-lg px-3 py-2 text-sm break-words overflow-wrap-anywhere ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      hyphens: "auto",
                    }}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</div>
                  </div>
                  {message.isUser && (
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center mt-1">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "hi"
                    ? "अपना संदेश टाइप करें..."
                    : language === "te"
                      ? "మీ సందేశాన్ని టైప్ చేయండి..."
                      : "Type your message..."
                }
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
