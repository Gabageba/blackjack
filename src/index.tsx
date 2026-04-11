import './i18n';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyles } from '@styles/GlobalStyles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <Suspense fallback={<div style={{ padding: 24, fontFamily: 'system-ui' }}>…</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
);
