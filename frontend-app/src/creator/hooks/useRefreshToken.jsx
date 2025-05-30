import axios from '../api/axios';
import { useAuthContext } from '../contexts/AuthContext';
import { decodeToken } from '../utils/decodeToken';


const useRefreshToken = () => {
    const { setAuth } = useAuthContext();
    const refresh = async() => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        const newAuth = decodeToken(response.data.accessToken);
        if (newAuth) {
            setAuth(newAuth);
        }
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;