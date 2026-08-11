# backend/services/whatsapp_service.py
from twilio.rest import Client
import asyncio
from typing import Dict, Any
import json
from datetime import datetime

from config import settings

class WhatsAppService:
    def __init__(self):
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )
        self.whatsapp_number = settings.WHATSAPP_NUMBER
        self.pending_sessions = {}

    async def start(self):
        """Inicia o bot do WhatsApp"""
        print("Chat da Garagem 156A iniciado!")

    async def send_message(self, to: str, message: str):
        """Envia mensagem via WhatsApp"""
        try:
            msg = self.client.messages.create(
                body=message,
                from_=f'whatsapp:{self.whatsapp_number}',
                to=f'whatsapp:{to}'
            )
            return msg.sid
        except Exception as e:
            print(f"Erro ao enviar mensagem: {e}")
            return None

    async def send_pedido_confirmacao(self, to: str, pedido_id: int, nome_cliente: str):
        """Envia confirmação de pedido"""
        message = (
            f"✅ *Pedido Confirmado!*\n\n"
            f"Olá {nome_cliente},\n\n"
            f"Seu pedido *#{pedido_id}* foi confirmado com sucesso!\n\n"
            f"📦 Status: Em preparação\n"
            f"🚚 Você receberá o código de rastreio em breve.\n\n"
            f"Acompanhe seu pedido: {settings.SITE_URL}/pedidos/{pedido_id}\n\n"
            f"Obrigado por comprar na Garagem 156A! 🏎️"
        )
        await self.send_message(to, message)

    async def send_rastreio_update(self, to: str, pedido_id: int, rastreio: Dict):
        """Envia atualização de rastreio"""
        message = (
            f"📦 *Atualização de Entrega*\n\n"
            f"Pedido *#{pedido_id}*\n\n"
            f"Status: {rastreio['status']}\n"
            f"Local: {rastreio.get('local', 'N/A')}\n"
            f"Data: {rastreio.get('data', 'N/A')}\n\n"
        )

        if rastreio.get('previsao_entrega'):
            message += f"📅 Previsão de entrega: {rastreio['previsao_entrega']}\n\n"

        message += f"🔗 Acompanhe: {settings.SITE_URL}/pedidos/{pedido_id}/rastreio"

        await self.send_message(to, message)

    async def process_incoming_message(self, data: Dict, background_tasks):
        """Processa mensagens recebidas"""
        from_number = data.get('From', '').replace('whatsapp:', '')
        message_body = data.get('Body', '').lower().strip()

        # Comandos do bot
        if message_body in ['oi', 'olá', 'ola', 'menu']:
            await self.send_menu(from_number)
        elif message_body.startswith('pedido'):
            await self.handle_pedido_consult(from_number, message_body)
        elif message_body.startswith('garagem'):
            await self.handle_garagem_consult(from_number)
        elif message_body.startswith('buscar'):
            await self.handle_buscar_miniatura(from_number, message_body)
        elif message_body == 'ajuda':
            await self.send_help(from_number)
        else:
            await self.send_message(
                from_number,
                "Desculpe, não entendi. Digite *menu* para ver as opções disponíveis."
            )

    async def send_menu(self, to: str):
        """Envia menu principal"""
        menu = (
            "🏎️ *Garagem 156A - Menu*\n\n"
            "Escolha uma opção:\n\n"
            "1️⃣ Digite *pedido [número]* para consultar pedido\n"
            "2️⃣ Digite *garagem* para ver sua coleção\n"
            "3️⃣ Digite *buscar [termo]* para buscar miniaturas\n"
            "4️⃣ Digite *novidades* para ver lançamentos\n"
            "5️⃣ Digite *ajuda* para ajuda\n\n"
            "Ou acesse nosso site: garagem156a.com.br"
        )
        await self.send_message(to, menu)

    async def send_help(self, to: str):
        """Envia mensagem de ajuda"""
        help_msg = (
            "❓ *Ajuda - Garagem 156A*\n\n"
            "Comandos disponíveis:\n"
            "• *menu* - Menu principal\n"
            "• *pedido [número]* - Consultar pedido\n"
            "• *garagem* - Sua coleção\n"
            "• *buscar [termo]* - Buscar miniaturas\n"
            "• *suporte* - Falar com atendente\n\n"
            "Horário de atendimento: Seg-Sex 9h às 18h"
        )
        await self.send_message(to, help_msg)