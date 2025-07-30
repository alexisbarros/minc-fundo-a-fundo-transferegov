import React, { useState, useRef, useEffect } from 'react';

interface Ente {
  uniqueId: string;
  name: string;
}

interface AutocompleteInputProps {
  entes: Ente[];
  onSelect: (ente: Ente) => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  entes,
  onSelect,
  placeholder = "Digite o nome ou CNPJ do ente...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredEntes, setFilteredEntes] = useState<Ente[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtra os entes baseado no input
  useEffect(() => {
    if (!inputValue.trim() || isSelected) {
      setFilteredEntes([]);
      setIsOpen(false);
      return;
    }

    const filtered = entes.filter(ente => 
      ente.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      ente.uniqueId.includes(inputValue)
    ).slice(0, 10); // Limita a 10 resultados

    setFilteredEntes(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [inputValue, entes, isSelected]);

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Se o usuário começar a digitar novamente, resetar o estado de seleção
    if (isSelected) {
      setIsSelected(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredEntes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredEntes.length) {
          handleSelect(filteredEntes[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (ente: Ente) => {
    setInputValue(ente.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsSelected(true);
    onSelect(ente);
  };

  const handleInputFocus = () => {
    // Só mostra as opções se não estiver selecionado e houver texto
    if (!isSelected && inputValue.trim() && filteredEntes.length > 0) {
      setIsOpen(true);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    // Formata CNPJ: XX.XXX.XXX/XXXX-XX
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${className}`}
      />
      
      {/* Ícone de busca */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Dropdown de sugestões */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredEntes.map((ente, index) => (
            <div
              key={ente.uniqueId}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelect(ente)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 truncate">
                  {ente.name}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  {formatCNPJ(ente.uniqueId)}
                </span>
              </div>
            </div>
          ))}
          
          {filteredEntes.length === 0 && inputValue.trim() && !isSelected && (
            <div className="px-4 py-3 text-gray-500 text-center">
              Nenhum ente encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 