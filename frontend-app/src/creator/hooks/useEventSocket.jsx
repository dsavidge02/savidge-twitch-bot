import { useEffect } from "react";
import { io } from "socket.io-client";

const useEventSocket = ({ onEvents }) => {
    useEffect(() => {
        const socket = io("http://localhost:3001");

        onEvents.forEach(({ trigger, action }) => {
            socket.on(trigger, action);
        });

        return () => {
            onEvents.forEach(({ trigger, action }) => {
                socket.off(trigger, action);
            });
            socket.disconnect();
        }
    }, []);
};

export default useEventSocket;