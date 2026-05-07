import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PatientProvider } from '@/lib/context/PatientContext';
import App from './App';
import PatientPage from './pages/patient/[id]';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/patient/:id',
    element: <PatientPage />,
  },
  {
    path: '/patient/new',
    element: <PatientPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PatientProvider>
      <RouterProvider router={router} />
    </PatientProvider>
  </StrictMode>
);
