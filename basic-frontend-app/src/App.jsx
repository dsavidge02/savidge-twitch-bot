import { Link, Outlet } from 'react-router-dom';
import './App.css';

const App = () => {
    return (
        <div className="app-content">
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default App;