import { createContext, useContext, useState, useEffect } from 'react';
import createApiClient from './ApiCommon.jsx';
export const ApiPublicContext = createContext(null);

export default function ApiPublicProvider({children}){

    const [API_AUTH,        setAPI_AUTH]        = useState(null);
    const [API_TEST,        setAPI_TEST]        = useState(null);
    const [loading,         setLoading]         = useState(true);
    const [error,           setError]           = useState(null);

    useEffect(() => {

        const fetchData = async () => {
          try {
            const response              = await fetch(`${import.meta.env.VITE_APP_PATH}/config/webServicesConfig.json`);
            if (!response.ok)           throw new Error('Error al cargar el archivo webServicesConfig.json');
            const jsonData              = await response.json();
            const ApiClient_APIAUTH     = createApiClient(`${jsonData.AUTH.baseUrl}`);
            const ApiClient_APITEST     = createApiClient(`${jsonData.TEST.baseUrl}`);
            const auth = {
              login: async (username, password)=>{
                  const response = await ApiClient_APIAUTH.post(jsonData.AUTH.methods.LOGIN,{
                      username:     username,
                      password:     password
                  });
                  return response.data;
              },
            };
            const test = {
              test_config: async ()=>{
                  const response = await ApiClient_APITEST.get(jsonData.TEST.methods.TEST_CONFIG,{withCredentials: true});
                  return response.data;
              },
            };

            setAPI_AUTH(auth);
            setAPI_TEST(test);
            console.log('ApiPublicProvider ready');
          } catch (e) {
            console.log('ApiPublicProvider error',{e});
            setError(e.message);
          } finally {
            console.log('ApiPublicProvider finished loading');
            setLoading(false);
          }
        };

        fetchData();

    }, []);

    return <ApiPublicContext.Provider value={{error, loading, API_AUTH, API_TEST}}>
        {children}
    </ApiPublicContext.Provider>
}

export function useApiPublicContext(){
    const context = useContext(ApiPublicContext)
    if(context === undefined) throw new Error('useApiPublicContext debe ser usado dentro de ApiPublicContextProvider')
    return context;
}