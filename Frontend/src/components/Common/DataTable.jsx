import React, { useMemo, useState } from 'react';

export default function DataTable({ columns, rows, pageSize = 6 }) {
  const [sortKey, setSortKey] = useState(columns[0]?.key || '');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const sorted = [...rows].sort((a, b) => {
      const aValue = a[sortKey] ?? '';
      const bValue = b[sortKey] ?? '';
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
      return String(aValue).localeCompare(String(bValue));
    });
    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  }, [rows, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIndex, startIndex + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  };

  return (
    <div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.sortable ? (
                    <button type="button" onClick={() => handleSort(column.key)}>
                      {column.label} {sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, index) => (
              <tr key={row.id ?? `${row.name ?? 'row'}-${index}`}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination" style={{ marginTop: 12 }}>
        <button className="btn btn-secondary" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>Anterior</button>
        <span style={{ color: '#cbd5e1' }}>Página {currentPage} de {totalPages}</span>
        <button className="btn btn-secondary" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Próxima</button>
      </div>
    </div>
  );
}
