import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchPokemonList = async ({ pageParam = 0, limit = 20 }) => {
  const offset = pageParam * limit;
  const response = await axios.get(`${BASE_URL}/pokemon`, {
    params: {
      limit,
      offset,
    },
  });
  return response.data;
};

export const fetchPokemonDetails = async (name) => {
  const response = await axios.get(`${BASE_URL}/pokemon/${name}`);
  return response.data;
};

export const fetchTypeDetails = async (url) => {
  const response = await axios.get(url);
  return response.data;
};
