// src/components/WhatsApp/ChatSimulator.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Space, Typography, Divider } from 'antd';
import { SendOutlined, WhatsAppOutlined, RobotOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ChatSimulator.css';

const { Text, Paragraph } = Typography;

const ChatSimulator = ({ cliente, onSendMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Olá! Como posso ajudar?',
      time: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      type: 'user',
      text: newMessage,
      time: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(newMessage),
        time: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const responses = {
      'pedido': 'Seu pedido #123 está em processamento. Digite "rastreio" para acompanhar.',
      'rastreio': 'Seu pedido está a caminho! Previsão de entrega: 25/07/2024.',
      'garagem': 'Você tem 15 miniaturas na sua garagem. Quer ver a lista?',
      'preço': 'Nossos preços variam de R$ 29,90 a R$ 999,90. Qual modelo você procura?',
      'default': 'Entendi! Um atendente vai te ajudar. Enquanto isso, você pode digitar "menu" para ver as opções.'
    };

    const lowercaseMsg = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseMsg.includes(key)) return response;
    }
    return responses.default;
  };

  const quickReplies = ['📦 Meu Pedido', '🏎️ Minha Garagem', '💰 Preços', '📞 Falar com Atendente'];

  return (
    <Card className="chat-simulator">
      <div className="chat-header">
        <Space>
          <Avatar icon={<WhatsAppOutlined />} style={{ backgroundColor: '#25D366' }} />
          <div>
            <Text strong>{cliente?.nome || 'Cliente'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {cliente?.telefone || '(00) 00000-0000'}
            </Text>
          </div>
        </Space>
        <Tag color="green">Online</Tag>
      </div>

      <Divider />

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-avatar">
              {msg.type === 'bot' ? (
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#25D366' }} />
              ) : (
                <Avatar icon={<WhatsAppOutlined />} style={{ backgroundColor: '#1890ff' }} />
              )}
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <Paragraph>{msg.text}</Paragraph>
              </div>
              <Text type="secondary" className="message-time">
                {moment(msg.time).format('HH:mm')}
              </Text>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-replies">
        {quickReplies.map((reply) => (
          <Button
            key={reply}
            size="small"
            onClick={() => setNewMessage(reply.replace(/[📦🏎️💰📞]/g, '').trim())}
          >
            {reply}
          </Button>
        ))}
      </div>

      <div className="chat-input">
        <Input
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={handleSend}
          suffix={
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!newMessage.trim()}
            />
          }
        />
      </div>
    </Card>
  );
};

export default ChatSimulator;