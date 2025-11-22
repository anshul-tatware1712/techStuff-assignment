'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchPokemonDetails, fetchTypeDetails } from '../lib/api';


export default function PokemonDetails({ pokemonName }) {
  const [activeTab, setActiveTab] = useState(0);

  const { data: pokemon, isLoading: isPokemonLoading } = useQuery({
    queryKey: ['pokemon', pokemonName],
    queryFn: () => fetchPokemonDetails(pokemonName),
    enabled: !!pokemonName,
  });

  const activeTypeUrl = pokemon?.types[activeTab]?.type?.url;

  const { data: typeData, isLoading: isTypeLoading } = useQuery({
    queryKey: ['type', activeTypeUrl],
    queryFn: () => fetchTypeDetails(activeTypeUrl),
    enabled: !!activeTypeUrl,
  });

  if (!pokemonName) return <div className="p-4 text-gray-500">Select a Pokemon to view details</div>;
  if (isPokemonLoading) return <div className="p-4">Loading details...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-[400px]">
      <h2 className="text-2xl font-bold mb-4 capitalize text-gray-900">{pokemon.name}</h2>
      
      <div className="mb-4">
        <img 
          src={pokemon.sprites?.front_default} 
          alt={pokemon.name} 
          className="w-32 h-32 mx-auto"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Types</h3>
        <div className="flex border-b border-gray-200">
          {pokemon.types.map((typeInfo, index) => (
            <button
              key={typeInfo.type.name}
              className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                activeTab === index
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {typeInfo.type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {isTypeLoading ? (
          <div>Loading type details...</div>
        ) : (
          typeData && (
            <div className="space-y-2 text-gray-900">
              <p><span className="font-semibold">Game Indices Count:</span> {typeData.game_indices?.length || 0}</p>
              <p><span className="font-semibold">Total Moves Count:</span> {typeData.moves?.length || 0}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
