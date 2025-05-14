import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import './CreatorUsers.css';

const CreatorUsers = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                isMounted && setUsers(response.data.users);
            }
            catch (err) {
                console.error(err);
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);
    console.log(users);
    return (
        <div className="creator-users-content">
            <h2>Welcome to the users page for savidge_af!</h2>
            <h3>USERS LIST</h3>
            {users?.length ?
            (
                <ul>
                    {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                </ul>
            ) : <p>No users to display</p>
            }
        </div>
    );
};

export default CreatorUsers;