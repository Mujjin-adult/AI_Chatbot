import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;
        
        const newMessage = { text: input, sender: 'user' };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/ai/chat/string?message=' + encodeURIComponent(input), {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream',
                    'Cache-Control': 'no-cache', // 캐시 방지
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiText = '';
            let buffer = ''; // 불완전한 라인을 저장할 버퍼

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                // UTF-8 디코딩 (스트림 모드로)
                const chunk = decoder.decode(value, { stream: true });
                
                // 버퍼에 추가
                buffer += chunk;
                
                // 완전한 라인들을 처리
                const lines = buffer.split('\n');
                
                // 마지막 라인은 불완전할 수 있으므로 버퍼에 보관
                buffer = lines.pop() || '';
                
                // 완전한 라인들만 처리
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const text = line.substring(5); // "data:" 제거
                        // 완전히 빈 줄이 아닌 경우만 추가
                        if (text !== '') {
                            aiText += text;
                        }
                    }
                }
                
                // 실시간으로 메시지 업데이트 (aiText가 있을 때만)
                if (aiText) {
                    setMessages([...updatedMessages, { text: aiText, sender: 'ai' }]);
                }
            }
            
            // 마지막 남은 바이트 처리
            const finalChunk = decoder.decode();
            if (finalChunk) {
                buffer += finalChunk;
            }
            
            // 버퍼에 남은 라인들 처리
            if (buffer) {
                const finalLines = buffer.split('\n');
                for (const line of finalLines) {
                    if (line.startsWith('data:')) {
                        const text = line.substring(5);
                        if (text !== '') {
                            aiText += text;
                        }
                    }
                }
            }
            
            // 최종 메시지 업데이트
            if (aiText) {
                setMessages([...updatedMessages, { text: aiText, sender: 'ai' }]);
            } else {
                // 응답이 없는 경우 에러 메시지
                const errorMessage = { text: '응답을 받지 못했습니다.', sender: 'ai' };
                setMessages([...updatedMessages, errorMessage]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching AI response", error);
            const errorMessage = { text: '죄송합니다. 오류가 발생했습니다: ' + error.message, sender: 'ai' };
            setMessages([...updatedMessages, errorMessage]);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <img src="ChatBot.png" alt="Chatbot Logo" className="chat-logo" />
                <div className="breadcrumb">Home &gt; Chat</div>
            </div>
            <div className="chatbox">
                {messages.map((message, index) => (
                    <div key={index} className={`message-container ${message.sender}`}>
                        <img
                            src={message.sender === 'user' ? 'user-icon.png' : 'ai-assistant.png'}
                            alt={`${message.sender} avatar`}
                            className="avatar"
                        />
                        <div className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-container ai">
                        <img src="ai-assistant.png" alt="AI avatar" className="avatar" />
                        <div className="message ai">...</div>
                    </div>
                )}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
