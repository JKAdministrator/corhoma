import { createContext, useContext, useState, useEffect } from 'react';
import createApiClient from './ApiCommon.jsx';

export const ApiPrivateContext = createContext(null);

export default function ApiPrivateProvider({children}){

    const [API_AUTH,        setAPI_AUTH]        = useState(null);
    const [API_ADM_TABLAS,  setAPI_ADM_TABLAS]  = useState(null);
    const [loading,         setLoading]         = useState(true);
    const [error,           setError]           = useState(null);

    useEffect(() => {

        const fetchData = async () => {
          try {
            const response              = await fetch(`${import.meta.env.VITE_APP_PATH}/config/webServicesConfig.json`);
            if (!response.ok)           throw new Error('Error al cargar el archivo webServicesConfig.json');
            const jsonData              = await response.json();
            const ApiClient_APIAUTH     = createApiClient(`${jsonData.AUTH.baseUrl}`);
            const ApiClient_ADMTABLAS   = createApiClient(`${jsonData.ADM_TABLAS.baseUrl}`);
            const admTablas = {
              getTable: async (tableCode)=>{
                  const response = await ApiClient_ADMTABLAS.get(`/Sw3_admTablas_getTable.php?tabla=${tableCode}`);
                  return response.data;
              }
            };
            const auth = {
              logoff: async ()=>{
                  return {};
              }
            };
            setAPI_AUTH(auth);
            setAPI_ADM_TABLAS(admTablas);  
            console.log('ApiPrivateProvider ready');
      
          } catch (error) {
            console.log('ApiPrivateProvider error',{e});
            setError(error.message);
          } finally {
            console.log('ApiPrivateProvider finished loading');
            setLoading(false);
          }
        };
        fetchData();
    }, []);

    return <ApiPrivateContext.Provider value={{error, loading, API_AUTH, API_ADM_TABLAS}}>
        {children}
    </ApiPrivateContext.Provider>
}

export function useApiPrivateContext(){
    const context = useContext(ApiPrivateContext)
    if(context === undefined) throw new Error('useApiPrivateContext debe ser usado dentro de un ApiPrivateContextProvider')
    return context;
}
