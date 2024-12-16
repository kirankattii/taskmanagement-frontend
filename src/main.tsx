
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
    <BrowserRouter>
     <AppContextProvider>
      <App />
     </AppContextProvider>
    </BrowserRouter>
);
