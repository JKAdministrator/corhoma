import { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode } from "jwt-decode";
import axios from 'axios';
export const AppContext = createContext(null);

const response    = await fetch(`${import.meta.env.VITE_APP_PATH}/config/webServicesConfig.json`);
if (!response.ok) throw new Error('Error al cargar el archivo webServicesConfig.json');
const jsonData = await response.json();

export default function AppContextProvider({children}){
    const [user, setUser] = useState(undefined);
    const [errors, setErrors] = useState([]);
    const [API_AUTH, setAPI_AUTH] = useState(null);
    const [API_ADM_TABLAS, setAPI_ADM_TABLAS] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

                
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
                if (token) config.headers.Authorization = `Bearer ${token}`;

                if(config.url == jsonData.AUTH.methods.REFRESH){ //  '/Sw3_auth_refresh.php'){
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
                const originalRequest = response.config;
                console.log('interceptor ',{response,retry:originalRequest._retry})
                if (response.data.cod === '401' && !originalRequest._retry) {
                    try {
                        console.log('interceptor retry',{jsonData})
                        originalRequest._retry = true;
                        const accessToken = localStorage.getItem('accessToken');
                        const response = await createApiClient(`${jsonData.AUTH.baseUrl}`).post(`/Sw3_auth_refresh.php`, {
                            Authorization: `Bearer ${accessToken}`
                        });
                        if(response.data.cod != '200') {
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            window.location.href = `${import.meta.env.VITE_APP_PATH}login`;
                            //console.error('refreshToken() Error al obtener un nuevo token:', error);
                            throw response.data.err;
                        }
                        const newToken = response.data.dat.token;
                        localStorage.setItem('accessToken',newToken);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        return apiClient(originalRequest);
                    } catch (error) {
                        // Manejar error de obtención de nuevo token (redireccionar a login, etc.)
                        console.error('Error al refrescar el token:', error);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = `${import.meta.env.VITE_APP_PATH}login`;
                        return response;
                    }
                }
                return response;
            });
        
            return apiClient;
        };
  

        const fetchData = async () => {
          try {
            const response    = await fetch(`${import.meta.env.VITE_APP_PATH}/config/webServicesConfig.json`);
            if (!response.ok) throw new Error('Error al cargar el archivo webServicesConfig.json');
            const jsonData = await response.json();
            const ApiClient_APIAUTH = createApiClient(`${jsonData.AUTH.baseUrl}`);//'https://172.16.0.29:6051/Sw3WebApps_v.3.7.5_DESA_REACT/Sw3Commons');
            const ApiClient_ADMTABLAS = createApiClient(`${jsonData.ADM_TABLAS.baseUrl}`);//'https://172.16.0.29:6051/Sw3WebApps_v.3.7.5_DESA_REACT/Sw3Commons');
            const admTablas = {
              getTable: async (tableCode)=>{
                  const response = await ApiClient_ADMTABLAS.get(`/Sw3_admTablas_getTable.php?tabla=${tableCode}`);
                  return response.data;
              }
            };
            const auth = {
              login: async (username, password)=>{
                  const response = await ApiClient_APIAUTH.post(jsonData.AUTH.methods.LOGIN,{
                      username:     username,
                      password:     password
                  });
                  return response.data;
              }
            };
            setAPI_AUTH(auth);
            setAPI_ADM_TABLAS(admTablas);        
          } catch (error) {
            addError(error.message);
          } finally {
            console.log('useAppApi.loading set to false');
            setLoading(false);
          }
        };
        fetchData();
      }, []);



    const removeError = (codeToRemove)=>{
        setErrors((currentErrors)=>{
            const index = currentErrors.findIndex((error)=>{
                return error.code === codeToRemove
            });
            if(index > -1) currentErrors.splice(index,1);
            return [...currentErrors];
        })
    }

    const addError = (errorMessage)=>{
        const dateCurrent = new Date();
        setErrors((currentErrors)=>{
            return [...currentErrors, {code:dateCurrent.toISOString().toString(), errorMessage}];
        })
    }
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(undefined);
    };
    const login = (jwtAccesToken, jwtRefreshToken)=>{
        saveTokens(jwtAccesToken, jwtRefreshToken);
        trySetUserFromCurrentTokens();
    }
    const saveTokens = (jwtAccessToken, jwtRefreshToken) => {
        localStorage.setItem("accessToken", jwtAccessToken);
        localStorage.setItem("refreshToken", jwtRefreshToken);
    };
    const getTokens = () => {
        return {
            jwtAccessToken:localStorage.getItem("accessToken")
            ,jwtRefreshToken:localStorage.getItem("refreshToken")
        }
    };

    const getCurrentUser = ()=>{
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if(accessToken && refreshToken && accessToken != '' && refreshToken != ''){
            try{
                const decodedData = jwtDecode(accessToken);

                console.log('ok',{decodedData});
                return decodedData.user;
            } catch(e){
                console.log('error',{e})
            }
        }
        console.log('return null');
        return null
    }

    const trySetUserFromCurrentTokens = ()=>{
        const userData = getCurrentUser();
        if(userData){
            setUser(userData);
            return true
        } 
        return false;
    }


    return <AppContext.Provider value={{loading, API_AUTH, API_ADM_TABLAS, user, errors, removeError, addError, saveTokens, login ,logout, getCurrentUser, trySetUserFromCurrentTokens, getTokens}}>
        {children}
    </AppContext.Provider>

}

export function useAppContext(){
    const context = useContext(AppContext)
    if(context === undefined){
        throw new Error('useAppContext must be used within an AppContextProvider')
    }
    return context;
}