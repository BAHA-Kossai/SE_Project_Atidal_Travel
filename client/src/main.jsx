import { createRoot } from 'react-dom/client';
import AdminSettings from './pages/admin_settings';


const rootElement = document.getElementById('root');

createRoot(rootElement).render(
    <AdminSettings />
);