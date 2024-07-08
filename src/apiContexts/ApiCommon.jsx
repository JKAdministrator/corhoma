import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.origin = true;
let jsonData;
fetch(`${import.meta.env.VITE_APP_PATH}/config/webServicesConfig.json`).then(async (response)=>{
    if (!response.ok) throw new Error('Error al cargar el archivo webServicesConfig.json');
    jsonData      = await response.json();
}).catch((e)=>{
    throw new Error(e);
})

const requestInterceptorSuccess = (config) => {
    const token = localStorage.getItem('accessToken');

    if (token)  config.headers.Authorization = `Bearer ${token}`;
    if(config.url == jsonData.AUTH.methods.REFRESH){ //  '/Sw3_auth_refresh.php'){
        config.headers.grant_type       = `refresh_token`;
        config.headers.refresh_token    = localStorage.getItem('refreshToken');    
    }
    config.headers['Content-Type']                  = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apngapplication/json;charset=UTF-8';
    
    /*;q=0.8,application/signed-exchange;v=b3;q=0.7*/
    return config;
};
const requestInterceptorError = (error) => { return Promise.reject(error); };

const responseInterceptor = async (response) => {
    const originalRequest = response.config;
    if (response.data.cod === '401' && !originalRequest._retry) {
        try {
            originalRequest._retry  = true;
            const accessToken       = localStorage.getItem('accessToken');
            const response          = await createApiClient(`${jsonData.AUTH.baseUrl}`).post(`/Sw3_auth_refresh.php`, {
                Authorization: `Bearer ${accessToken}`
            });
            if(response.data.cod != '200') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = `${import.meta.env.VITE_APP_PATH}login`;
                throw response.data.err;
            }
            const newToken = response.data.dat.token;
            localStorage.setItem('accessToken',newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = `${import.meta.env.VITE_APP_PATH}login`;
            return response;
        }
    }
    return response;
}


// Función para crear una instancia de Axios con interceptores
const createApiClient = (baseURL) => {
    const apiClient = axios.create({
        baseURL,
        //withCredentials:true,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
    });
    // Interceptor para agregar el token JWT a cada solicitud y el refresh si se pide refresh 
    apiClient.interceptors.request.use(requestInterceptorSuccess,requestInterceptorError);
    // Interceptor para manejar respuestas de error
    apiClient.interceptors.response.use(responseInterceptor);
    return apiClient;
};

export default createApiClient;