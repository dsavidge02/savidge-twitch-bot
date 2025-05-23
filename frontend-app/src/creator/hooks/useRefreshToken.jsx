import axios from '../api/axios';
import { useAuthContext } from '../contexts/AuthContext';

const useRefreshToken = () => {
    const { setAuth } = useAuthContext();
    const refresh = async() => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => ({
            ...prev,
            accessToken: response.data.accessToken
        }));
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;