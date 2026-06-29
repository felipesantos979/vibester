import type { NavigateFunction } from 'react-router-dom';
import { clearSession } from './session';

export const handleLogout = (navigate: NavigateFunction) => {
  clearSession();
  navigate('/login');
};
