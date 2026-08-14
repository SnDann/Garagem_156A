from datetime import datetime
import enum

from sqlalchemy import (
    Boolean,
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
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker

from config import settings


class Base(DeclarativeBase):
    pass


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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    cpf: Mapped[str | None] = mapped_column(String(14), unique=True)
    endereco: Mapped[str | None] = mapped_column(String(300))
    cidade: Mapped[str | None] = mapped_column(String(100))
    estado: Mapped[str | None] = mapped_column(String(2))
    cep: Mapped[str | None] = mapped_column(String(9))
    data_cadastro: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    total_compras: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[StatusCliente | None] = mapped_column(
        Enum(StatusCliente), default=StatusCliente.ATIVO
    )
    observacoes: Mapped[str | None] = mapped_column(Text)

    pedidos: Mapped[list["Pedido"]] = relationship("Pedido", back_populates="cliente")


class Miniatura(Base):
    __tablename__ = "miniaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(200), nullable=False)
    marca: Mapped[str] = mapped_column(String(100), nullable=False)
    escala: Mapped[str] = mapped_column(String(20), nullable=False)
    cor: Mapped[str | None] = mapped_column(String(50))
    categoria: Mapped[str | None] = mapped_column(String(100))
    preco_custo: Mapped[float] = mapped_column(Float, nullable=False)
    preco_venda: Mapped[float] = mapped_column(Float, nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, default=0)
    codigo_barras: Mapped[str | None] = mapped_column(String(50), unique=True)
    descricao: Mapped[str | None] = mapped_column(Text)
    foto_url: Mapped[str | None] = mapped_column(String(500))
    data_cadastro: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True)


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    cliente_id: Mapped[int] = mapped_column(Integer, ForeignKey("clientes.id"), nullable=False)
    data_pedido: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    status: Mapped[StatusPedido | None] = mapped_column(
        Enum(StatusPedido), default=StatusPedido.PENDENTE
    )
    valor_total: Mapped[float] = mapped_column(Float, default=0.0)
    forma_pagamento: Mapped[str | None] = mapped_column(String(50))
    codigo_rastreio: Mapped[str | None] = mapped_column(String(100))
    status_entrega: Mapped[str | None] = mapped_column(String(100))
    observacoes: Mapped[str | None] = mapped_column(Text)

    cliente: Mapped["Cliente"] = relationship("Cliente", back_populates="pedidos")
    itens: Mapped[list["ItemPedido"]] = relationship(
        "ItemPedido", back_populates="pedido", cascade="all, delete-orphan"
    )


class ItemPedido(Base):
    __tablename__ = "itens_pedido"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pedido_id: Mapped[int] = mapped_column(Integer, ForeignKey("pedidos.id"), nullable=False)
    miniatura_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("miniaturas.id"), nullable=False
    )
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False)
    preco_unitario: Mapped[float] = mapped_column(Float, nullable=False)

    pedido: Mapped["Pedido"] = relationship("Pedido", back_populates="itens")
    miniatura: Mapped["Miniatura"] = relationship("Miniatura")


class Gasto(Base):
    __tablename__ = "gastos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    descricao: Mapped[str] = mapped_column(String(300), nullable=False)
    valor: Mapped[float] = mapped_column(Float, nullable=False)
    categoria: Mapped[CategoriaGasto] = mapped_column(Enum(CategoriaGasto), nullable=False)
    data: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    comprovante_url: Mapped[str | None] = mapped_column(String(500))
    recorrente: Mapped[bool] = mapped_column(Boolean, default=False)
    data_cadastro: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    data_cadastro: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MensagemWhatsApp(Base):
    __tablename__ = "mensagens_whatsapp"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    conteudo: Mapped[str] = mapped_column(Text, nullable=False)
    tipo: Mapped[str | None] = mapped_column(String(50))
    data_criacao: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True)


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
