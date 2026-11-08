import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/hanken-grotesk';
import './styles/tokens.css';
import './styles/global.css';
import App from './App';

// Tymczasowy przełącznik akcentu do porównań: ?accent=kobalt albo ?accent=ogien
const akcent = new URLSearchParams(location.search).get('accent');
if (akcent === 'kobalt' || akcent === 'ogien') {
  document.documentElement.dataset.accent = akcent;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
