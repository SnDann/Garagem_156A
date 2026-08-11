from datetime import datetime
import enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    event,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

from config import settings

Base = declarative_base()


class StatusCliente(str, enum.Enum):
    ATIVO = "ativo"
    INATIVO = "inativo"
    VIP = "vip"
    BLOQUEADO = "bloqueado"


class StatusPedido(str, enum.Enum):
    PENDENTE = "pendente"
    CONFIRMADO = "confirmado"
    EM_PREPARACAO = "em_preparacao"
    ENVIADO = "enviado"
    ENTREGUE = "entregue"
    CANCELADO = "cancelado"


class CategoriaGasto(str, enum.Enum):
    ESTOQUE = "Estoque"
    MARKETING = "Marketing"
    OPERACIONAL = "Operacional"
    INFRAESTRUTURA = "Infraestrutura"
    OUTROS = "Outros"


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    telefone = Column(String(20), nullable=False)
    cpf = Column(String(14), unique=True)
    endereco = Column(String(300))
    cidade = Column(String(100))
    estado = Column(String(2))
    cep = Column(String(9))
    data_cadastro = Column(DateTime, default=datetime.utcnow)
    total_compras = Column(Float, default=0.0)
    status = Column(Enum(StatusCliente), default=StatusCliente.ATIVO)
    observacoes = Column(Text)

    pedidos = relationship("Pedido", back_populates="cliente")


class Miniatura(Base):
    __tablename__ = "miniaturas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    marca = Column(String(100), nullable=False)
    escala = Column(String(20), nullable=False)
    cor = Column(String(50))
    categoria = Column(String(100))
    preco_custo = Column(Float, nullable=False)
    preco_venda = Column(Float, nullable=False)
    quantidade = Column(Integer, default=0)
    codigo_barras = Column(String(50), unique=True)
    descricao = Column(Text)
    foto_url = Column(String(500))
    data_cadastro = Column(DateTime, default=datetime.utcnow)
    ativo = Column(Boolean, default=True)


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    data_pedido = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(StatusPedido), default=StatusPedido.PENDENTE)
    valor_total = Column(Float, default=0.0)
    forma_pagamento = Column(String(50))
    codigo_rastreio = Column(String(100))
    status_entrega = Column(String(100))
    observacoes = Column(Text)

    cliente = relationship("Cliente", back_populates="pedidos")
    itens = relationship("ItemPedido", back_populates="pedido", cascade="all, delete-orphan")


class ItemPedido(Base):
    __tablename__ = "itens_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    miniatura_id = Column(Integer, ForeignKey("miniaturas.id"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)

    pedido = relationship("Pedido", back_populates="itens")
    miniatura = relationship("Miniatura")


class Gasto(Base):
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(300), nullable=False)
    valor = Column(Float, nullable=False)
    categoria = Column(Enum(CategoriaGasto), nullable=False)
    data = Column(DateTime, nullable=False)
    comprovante_url = Column(String(500))
    recorrente = Column(Boolean, default=False)
    data_cadastro = Column(DateTime, default=datetime.utcnow)


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    data_cadastro = Column(DateTime, default=datetime.utcnow)


class MensagemWhatsApp(Base):
    __tablename__ = "mensagens_whatsapp"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    conteudo = Column(Text, nullable=False)
    tipo = Column(String(50))
    data_criacao = Column(DateTime, default=datetime.utcnow)
    ativo = Column(Boolean, default=True)


DATABASE_URL = settings.DATABASE_URL
engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
