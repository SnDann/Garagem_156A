// src/components/Common/SearchBar.jsx
import React, { useState } from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const SearchBar = ({ onSearch, filters = [], placeholder = 'Buscar...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({ search: searchTerm, ...activeFilters });
  };

  return (
    <div className="search-bar">
      <Space>
        <Input
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        
        <Button 
          icon={<FilterOutlined />} 
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
        </Button>
        
        <Button type="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Space>

      {showFilters && (
        <div className="search-filters">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              placeholder={filter.placeholder}
              style={{ width: 200 }}
              onChange={(value) => setActiveFilters({
                ...activeFilters,
                [filter.key]: value
              })}
              allowClear
            >
              {filter.options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;