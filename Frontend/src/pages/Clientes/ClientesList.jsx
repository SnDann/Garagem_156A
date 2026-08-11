import React, { useEffect, useState } from 'react';
import DataTable from '../../components/Common/DataTable';
import { listClientes, createCliente, updateCliente, deleteCliente } from '../../services/api';

export default function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const data = await listClientes();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const resetForm = () => {
    setForm({ nome: '', email: '', telefone: '' });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await updateCliente(editingId, form);
        setSuccess('Cliente atualizado com sucesso.');
      } else {
        await createCliente(form);
        setSuccess('Cliente criado com sucesso.');
      }
      resetForm();
      await carregarClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setForm({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
    setSuccess('');
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Deseja realmente excluir este cliente?');
    if (!confirmed) return;
    try {
      await deleteCliente(id);
      setSuccess('Cliente removido com sucesso.');
      await carregarClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredClientes = clientes.filter((cliente) => {
    const term = filter.toLowerCase();
    return `${cliente.nome} ${cliente.email} ${cliente.telefone}`.toLowerCase().includes(term);
  });

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2 className="page-title">Clientes</h2>
          <p className="page-subtitle">Gerencie clientes e acompanhe seus contatos.</p>
        </div>
      </div>

      {error ? <div className="notice error">{error}</div> : null}
      {success ? <div className="notice">{success}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-mail" />
        <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="Telefone" />
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">{editingId ? 'Salvar alterações' : 'Adicionar cliente'}</button>
          {editingId ? <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancelar</button> : null}
        </div>
      </form>

      <div className="filter-bar">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar por nome, e-mail ou telefone" />
      </div>

      {loading ? <p>Carregando...</p> : (
        filteredClientes.length === 0 ? (
          <div className="empty-state">Nenhum cliente encontrado.</div>
        ) : (
          <DataTable
            columns={[
              { key: 'nome', label: 'Nome', sortable: true },
              { key: 'email', label: 'E-mail', sortable: true },
              { key: 'telefone', label: 'Telefone', sortable: true },
              { key: 'actions', label: 'Ações', render: (cliente) => (
                <div className="table-actions">
                  <button className="table-btn btn-secondary" onClick={() => handleEdit(cliente)}>Editar</button>
                  <button className="table-btn btn-danger" onClick={() => handleDelete(cliente.id)}>Excluir</button>
                </div>
              ) },
            ]}
            rows={filteredClientes}
          />
        )
      )}
    </div>
  );
}
