import axiosRetry from 'axios-retry';
import axios from 'axios';
//import interceptors from '../interceptors/Interceptors.jsx';





// Función para crear una instancia de Axios con interceptores
const createApiClient = (baseURL) => {
    const apiClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
  
    // Interceptor para agregar el token JWT a cada solicitud
    apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('apiClient.interceptors.request',{config})
        if(config.url=='/Sw3_auth_refresh.php'){
            config.headers.grant_type = `refresh_token`;
            config.headers.refresh_token = localStorage.getItem('refreshToken');    
        }

        config.headers['Content-Type']                  = 'application/json;charset=UTF-8';
        //config.headers['Access-Control-Allow-Origin']   = '*';
        return config;
    }, (error) => {
      return Promise.reject(error);
    });
  
    // Interceptor para manejar respuestas de error
    apiClient.interceptors.response.use(async (response) => {
        console.log('interceptor response ',{response});
        const originalRequest = response.config;
        if (response.data.cod === '401' && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await API.auth.refresh();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (error) {
                // Manejar error de obtención de nuevo token (redireccionar a login, etc.)
                console.error('Error al refrescar el token:', error);
                return response;
            }
        }
        return response;
    });

    return apiClient;
};

const appApiClient = createApiClient('https://172.16.0.29:6051/Sw3WebApps_v.3.7.5_DESA_REACT/Sw3Commons');

const admTablas = {
    getTable: async (tableCode)=>{
        const response = await appApiClient.get(`/Sw3_admTablas_getTable.php?tabla=${tableCode}`);
        return response.data;
    }
};

const auth = {
    login: async (username, password)=>{
        const response = await appApiClient.post(`/Sw3_auth_login.php`,{
            username:     username,
            password:     password
        });
        return response.data;
    },
    refresh: async ()=> {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const refrehToken = localStorage.getItem('refreshToken');
            const response = await appApiClient.post(`/Sw3_auth_refresh.php`, {
              Authorization: `Bearer ${accessToken}`
            });
            if(response.data.cod != '200') throw response.data.err;
            const newToken = response.data.dat.token;
            localStorage.setItem('accessToken',newToken);
            return newToken;
          } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            //console.error('refreshToken() Error al obtener un nuevo token:', error);
            throw error;
          }
    }
};

const API = {
    admTablas: admTablas,
    auth: auth
};

export default API;