import { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode } from "jwt-decode";
import axios from 'axios';
export const AppContext = createContext(null);


export default function AppContextProvider({children}){
    const [user, setUser]       = useState(undefined);
    const [errors, setErrors]   = useState([]);

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


    return <AppContext.Provider value={{user, errors, removeError, addError, saveTokens, login ,logout, getCurrentUser, trySetUserFromCurrentTokens, getTokens}}>
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