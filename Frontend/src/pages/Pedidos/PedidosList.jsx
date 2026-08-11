import React, { useEffect, useState } from 'react';
import DataTable from '../../components/Common/DataTable';
import { listPedidos, createPedido, updatePedido, deletePedido } from '../../services/api';

export default function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ cliente_id: '', forma_pagamento: '', observacoes: '', valor_total: '' });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setForm({ cliente_id: '', forma_pagamento: '', observacoes: '', valor_total: '' });
    setEditingId(null);
  };

  const carregar = async () => {
    try {
      setLoading(true);
      const data = await listPedidos();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        cliente_id: Number(form.cliente_id),
        valor_total: Number(form.valor_total),
      };
      if (editingId) {
        await updatePedido(editingId, payload);
        setSuccess('Pedido atualizado com sucesso.');
      } else {
        await createPedido(payload);
        setSuccess('Pedido criado com sucesso.');
      }
      resetForm();
      await carregar();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (pedido) => {
    setEditingId(pedido.id);
    setForm({
      cliente_id: pedido.cliente_id,
      forma_pagamento: pedido.forma_pagamento || '',
      observacoes: pedido.observacoes || '',
      valor_total: pedido.valor_total || '',
    });
    setSuccess('');
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Deseja realmente excluir este pedido?');
    if (!confirmed) return;
    try {
      await deletePedido(id);
      setSuccess('Pedido removido com sucesso.');
      await carregar();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const term = filter.toLowerCase();
    return `${pedido.id} ${pedido.cliente_id} ${pedido.status || ''} ${pedido.forma_pagamento || ''}`.toLowerCase().includes(term);
  });

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2 className="page-title">Pedidos</h2>
          <p className="page-subtitle">Organize os pedidos e acompanhe o status.</p>
        </div>
      </div>

      {error ? <div className="notice error">{error}</div> : null}
      {success ? <div className="notice">{success}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <input value={form.cliente_id} type="number" onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} placeholder="ID do cliente" />
        <input value={form.forma_pagamento} onChange={(e) => setForm({ ...form, forma_pagamento: e.target.value })} placeholder="Forma de pagamento" />
        <input value={form.valor_total} type="number" onChange={(e) => setForm({ ...form, valor_total: e.target.value })} placeholder="Valor total" />
        <textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Observações" />
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">{editingId ? 'Salvar alterações' : 'Salvar pedido'}</button>
          {editingId ? <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancelar</button> : null}
        </div>
      </form>

      <div className="filter-bar">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar por cliente, forma de pagamento ou número" />
      </div>

      {loading ? <p>Carregando...</p> : (
        filteredPedidos.length === 0 ? (
          <div className="empty-state">Nenhum pedido encontrado.</div>
        ) : (
          <DataTable
            columns={[
              { key: 'id', label: '#', sortable: true },
              { key: 'cliente_id', label: 'Cliente', sortable: true },
              { key: 'valor_total', label: 'Valor', sortable: true, render: (pedido) => `R$ ${pedido.valor_total}` },
              { key: 'status', label: 'Status', sortable: true, render: (pedido) => <span className="status-pill">{pedido.status || 'Em andamento'}</span> },
              { key: 'actions', label: 'Ações', render: (pedido) => (
                <div className="table-actions">
                  <button className="table-btn btn-secondary" onClick={() => handleEdit(pedido)}>Editar</button>
                  <button className="table-btn btn-danger" onClick={() => handleDelete(pedido.id)}>Excluir</button>
                </div>
              ) },
            ]}
            rows={filteredPedidos}
          />
        )
      )}
    </div>
  );
}
