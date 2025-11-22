'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchPokemonList } from '../lib/api';
import PokemonDetails from './PokemonDetails';
import Loading from './Loading';
import ErrorDisplay from './ErrorDisplay';


export default function PokemonTable() {
  const [page, setPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pokemonList', page],
    queryFn: () => fetchPokemonList({ pageParam: page, limit }),
    keepPreviousData: true,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay message={error.message} retry={() => window.location.reload()} />;

  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mx-auto p-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Pokemon List</h1>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sr. Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Poke Name
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.results.map((pokemon, index) => (
                <tr
                  key={pokemon.name}
                  onClick={() => setSelectedPokemon(pokemon.name)}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer ${
                    selectedPokemon === pokemon.name ? 'bg-blue-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    {page * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                    {pokemon.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => {
              if (!data?.next) return;
              setPage((old) => old + 1);
            }}
            disabled={!data?.next}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="w-full flex-1 mt-12">
        <PokemonDetails pokemonName={selectedPokemon} />
      </div>
    </div>
  );
}
