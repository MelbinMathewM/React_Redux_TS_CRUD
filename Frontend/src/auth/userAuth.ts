import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const isTokenExpired = (token : string) => {
    if(!token) return true;
    const decodedStr : any = jwtDecode(token);
    return decodedStr.exp * 1000 < Date.now();
}

async function refreshToken(){
    const refreshToken = Cookies.get('refreshToken');
    if(refreshToken){
        try{
            const resp = await fetch('http://localhost:3000/refresh_token',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${refreshToken}`
                }
            });
            if(resp.status === 401){
                return null;
            }else{
                const data = await resp.json();
                return data.newAccessToken;
            }
        }catch(err){
            console.log(err);
        }
    }else{
        return null;
    }
}

export const verifyToken = async( accessToken : string ) => {
    try{
        const resp = await fetch('http://localhost:3000/verify_token',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });
        if(resp.status === 401){
            const newAccessToken = await refreshToken();
            if(newAccessToken){
                return newAccessToken;
            }else{
                return null;
            }
        }
        return accessToken;
    }catch(err){
        console.log(err);
    }
}

export async function userAuth( accessToken : string ) {
    if(isTokenExpired(accessToken)){
        const newAccessToken = await refreshToken();
        if(newAccessToken){
            return newAccessToken
        }
        return null;
    }else{
        const verifiedToken = await verifyToken(accessToken);
        return verifiedToken;
    }
}