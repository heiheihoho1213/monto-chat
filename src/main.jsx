import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { XProvider } from '@ant-design/x';
import { theme } from 'antd';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <XProvider locale="zh-CN" theme={{
      algorithm: theme.defaultAlgorithm,
    }}>
      <App />
    </XProvider>
  </StrictMode >,
)
