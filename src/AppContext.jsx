import { createContext, useContext, useState } from 'react';

export const AppContext = createContext(null);

export default function AppContextProvider({children}){
    const [user, setUser] = useState(undefined);
    const [errors, setErrors] = useState([]);

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

    return <AppContext.Provider value={{user, setUser, errors, removeError, addError}}>
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