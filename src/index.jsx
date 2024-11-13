import * as React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { ChakraProvider } from '@chakra-ui/react'
import App from './app.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
);