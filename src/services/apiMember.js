import axios from 'axios';

// https://sujeitoprogramador.com/r-api/?api=filmes/


const api = axios.create({
    baseURL: 'http://sistema.planoscs.com.br:8789'
});

export default api;
