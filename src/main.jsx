
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { MyProvider } from './utils/MyContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyProvider>
      <App />
    </MyProvider>
  </StrictMode>
);
