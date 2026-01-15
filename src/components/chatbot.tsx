'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user' as const, text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // MOCK AI response
    setTimeout(() => {
        let botResponseText = "I'm sorry, I can only answer questions about waste disposal, like 'how to dispose plastic?'.";
        const lowerCaseQuery = userMessage.text.toLowerCase();

        if (lowerCaseQuery.includes('plastic')) {
            botResponseText = "To dispose of plastic, please check the recycling number on the item. Most common plastics like PET (1) and HDPE (2) are widely recyclable. Rinse containers before placing them in the recycling bin.";
        } else if (lowerCaseQuery.includes('paper')) {
            botResponseText = "Paper and cardboard should be clean and dry to be recycled. Flatten cardboard boxes. Items like greasy pizza boxes or used paper towels should be composted if possible, not recycled.";
        } else if (lowerCaseQuery.includes('metal')) {
            botResponseText = "Metal items like aluminum and steel cans are highly recyclable. Please rinse them out before putting them in the recycling bin. For larger scrap metal, contact your local waste management facility.";
        } else if (lowerCaseQuery.includes('glass')) {
            botResponseText = "Glass bottles and jars can be recycled indefinitely! Rinse them and remove lids (metal lids can often be recycled separately). Check with your local facility if they require sorting by color.";
        } else if (lowerCaseQuery.includes('biodegradable') || lowerCaseQuery.includes('organic')) {
            botResponseText = "Biodegradable or organic waste, like food scraps and yard trimmings, can be composted. This turns waste into nutrient-rich soil. If you don't have a compost bin, check for local green waste collection programs.";
        }

      const botMessage = { sender: 'bot' as const, text: botResponseText };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-16 h-16 shadow-lg">
          {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
             <Card className="flex flex-col h-[60vh] shadow-xl animate-in fade-in-0 zoom-in-95 duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot /> Sortify AI Help
                    </CardTitle>
                    <CardDescription>
                        Ask me anything about waste disposal!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex justify-start">
                                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        <p className="text-sm">Thinking...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="e.g., How to dispose plastic?"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
      )}
    </>
  );
}
