import React, { useEffect, useState } from 'react';
import DataTable from '../../components/Common/DataTable';
import { listMiniaturas, createMiniatura, updateMiniatura, deleteMiniatura } from '../../services/api';

export default function MiniaturasList() {
  const [miniaturas, setMiniaturas] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    marca: '',
    escala: '',
    cor: '',
    categoria: '',
    preco_custo: '',
    preco_venda: '',
    quantidade: '',
    descricao: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setForm({
      nome: '',
      marca: '',
      escala: '',
      cor: '',
      categoria: '',
      preco_custo: '',
      preco_venda: '',
      quantidade: '',
      descricao: '',
    });
    setEditingId(null);
  };

  const carregar = async () => {
    try {
      setLoading(true);
      const data = await listMiniaturas();
      setMiniaturas(data);
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
        preco_custo: Number(form.preco_custo),
        preco_venda: Number(form.preco_venda),
        quantidade: Number(form.quantidade),
      };
      if (editingId) {
        await updateMiniatura(editingId, payload);
        setSuccess('Miniatura atualizada com sucesso.');
      } else {
        await createMiniatura(payload);
        setSuccess('Miniatura criada com sucesso.');
      }
      resetForm();
      await carregar();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nome: item.nome,
      marca: item.marca,
      escala: item.escala,
      cor: item.cor || '',
      categoria: item.categoria || '',
      preco_custo: item.preco_custo,
      preco_venda: item.preco_venda,
      quantidade: item.quantidade,
      descricao: item.descricao || '',
    });
    setSuccess('');
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Deseja realmente excluir esta miniatura?');
    if (!confirmed) return;
    try {
      await deleteMiniatura(id);
      setSuccess('Miniatura removida com sucesso.');
      await carregar();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredMiniaturas = miniaturas.filter((item) => {
    const term = filter.toLowerCase();
    return `${item.nome} ${item.marca} ${item.escala} ${item.categoria}`.toLowerCase().includes(term);
  });

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2 className="page-title">Miniaturas</h2>
          <p className="page-subtitle">Cadastre e controle o estoque das miniaturas.</p>
        </div>
      </div>

      {error ? <div className="notice error">{error}</div> : null}
      {success ? <div className="notice">{success}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" />
        <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} placeholder="Marca" />
        <input value={form.escala} onChange={(e) => setForm({ ...form, escala: e.target.value })} placeholder="Escala" />
        <input value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} placeholder="Cor" />
        <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Categoria" />
        <input value={form.preco_custo} type="number" onChange={(e) => setForm({ ...form, preco_custo: e.target.value })} placeholder="Preço de custo" />
        <input value={form.preco_venda} type="number" onChange={(e) => setForm({ ...form, preco_venda: e.target.value })} placeholder="Preço de venda" />
        <input value={form.quantidade} type="number" onChange={(e) => setForm({ ...form, quantidade: e.target.value })} placeholder="Quantidade" />
        <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" />
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">{editingId ? 'Salvar alterações' : 'Salvar miniatura'}</button>
          {editingId ? <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancelar</button> : null}
        </div>
      </form>

      <div className="filter-bar">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar por nome, marca ou categoria" />
      </div>

      {loading ? <p>Carregando...</p> : (
        filteredMiniaturas.length === 0 ? (
          <div className="empty-state">Nenhuma miniatura encontrada.</div>
        ) : (
          <DataTable
            columns={[
              { key: 'nome', label: 'Nome', sortable: true },
              { key: 'marca', label: 'Marca', sortable: true },
              { key: 'escala', label: 'Escala', sortable: true },
              { key: 'quantidade', label: 'Estoque', sortable: true },
              { key: 'preco_venda', label: 'Preço', sortable: true, render: (item) => `R$ ${item.preco_venda}` },
              { key: 'actions', label: 'Ações', render: (item) => (
                <div className="table-actions">
                  <button className="table-btn btn-secondary" onClick={() => handleEdit(item)}>Editar</button>
                  <button className="table-btn btn-danger" onClick={() => handleDelete(item.id)}>Excluir</button>
                </div>
              ) },
            ]}
            rows={filteredMiniaturas}
          />
        )
      )}
    </div>
  );
}
