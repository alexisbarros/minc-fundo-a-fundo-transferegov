import React, { useState, useMemo } from 'react';
import { entesUfCity } from '../assets/entes_uf_city';
import entesUf from '../assets/entes_uf';

interface Ente {
  state: string;
  city: string;
  uniqueId: string;
  name: string;
}

interface CascadingSelectsProps {
  onSelect: (ente: Ente) => void;
}

export const CascadingSelects: React.FC<CascadingSelectsProps> = ({ onSelect }) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedEnte, setSelectedEnte] = useState<string>('');

  const states = useMemo(() => {
    const uniqueStates = Array.from(new Set(entesUfCity.map(ente => ente.state)));
    return uniqueStates.sort();
  }, []);

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const stateCities = entesUfCity
      .filter(ente => ente.state === selectedState)
      .map(ente => ente.city);
    const uniqueCities = Array.from(new Set(stateCities));
    return uniqueCities.sort();
  }, [selectedState]);

  const entes = useMemo(() => {
    if (!selectedState || !selectedCity) return [];
    const filteredEntes = entesUfCity
      .filter(ente => ente.state === selectedState && ente.city === selectedCity);

    // Remover duplicatas baseado no uniqueId
    const uniqueEntes = filteredEntes.reduce<Ente[]>((acc, current) => {
      const x = acc.find(item => item.uniqueId === current.uniqueId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return uniqueEntes.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedState, selectedCity]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
    setSelectedEnte('');
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedEnte('');
  };

  const handleEnteChange = (enteId: string) => {
    setSelectedEnte(enteId);
    const ente = entes.find(e => e.uniqueId === enteId);
    if (ente) {
      onSelect(ente);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
            Estado:
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Selecione um estado</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
            Cidade:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!selectedState}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Selecione uma cidade</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-7">
          <label htmlFor="ente-select" className="block text-sm font-medium text-gray-700 mb-2">
            Ente:
          </label>
          <select
            id="ente-select"
            value={selectedEnte}
            onChange={(e) => handleEnteChange(e.target.value)}
            disabled={!selectedCity}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Selecione um ente</option>
            {entes
              .filter(ente => !(new Set(entesUf.map(e => e.uniqueId)).has(ente.uniqueId)))
              .map((ente) => (
                <option key={ente.uniqueId} value={ente.uniqueId}>
                  {ente.name} (CNPJ: {ente.uniqueId})
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};
