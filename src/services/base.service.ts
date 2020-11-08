import axios from 'axios';

export const service = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 3000,
});
