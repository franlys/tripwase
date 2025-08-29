import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestAuthContext: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState<string>('test@tripwase.com');
  const [loginPassword, setLoginPassword] = useState<string>('password123');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerName, setRegisterName] = useState<string>('');
  const [registerTerms, setRegisterTerms] = useState<boolean>(false);

  const { status, user, error, isLoading, login, register, logout, updateUser, clearError, checkPermission, hasRole, isTokenValid } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email: loginEmail, password: loginPassword });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email: registerEmail, password: registerPassword, name: registerName, acceptTerms: registerTerms });
  };

  if (status === 'authenticated' && user) {
    return (
      <div style={{ padding: '20px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <h2>Usuario Autenticado</h2>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1f2937', borderRadius: '8px' }}>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Rol: {user.role}</p>
          <p>Token válido: {isTokenValid() ? 'Sí' : 'No'}</p>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#065f46', borderRadius: '8px' }}>
          <h3>Permisos</h3>
          <p>basic_search: {checkPermission('basic_search') ? 'Sí' : 'No'}</p>
          <p>trip_planning: {checkPermission('trip_planning') ? 'Sí' : 'No'}</p>
          <p>Es admin: {hasRole('admin') ? 'Sí' : 'No'}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => updateUser({ preferences: { ...user.preferences, theme: user.preferences.theme === 'light' ? 'dark' : 'light' } })} style={{ padding: '8px 16px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '4px' }}>
            Toggle Tema
          </button>
          <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <h2>Test AuthContext</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Estado: {status}</p>
        <p>Cargando: {isLoading ? 'Sí' : 'No'}</p>
        {error && <p style={{ color: '#f87171' }}>Error: {error}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('login')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'login' ? '#3b82f6' : '#6b7280', color: 'white', border: 'none', borderRadius: '4px', marginRight: '5px' }}>
          Login
        </button>
        <button onClick={() => setActiveTab('register')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'register' ? '#3b82f6' : '#6b7280', color: 'white', border: 'none', borderRadius: '4px' }}>
          Registro
        </button>
      </div>

      {activeTab === 'login' && (
        <form onSubmit={handleLogin} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#1f2937', borderRadius: '8px' }}>
          <h3>Iniciar Sesión</h3>
          <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: 'none', backgroundColor: '#374151', color: 'white' }} required />
          <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Contraseña" style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: 'none', backgroundColor: '#374151', color: 'white' }} required />
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Credenciales: test@tripwase.com / password123</p>
        </form>
      )}

      {activeTab === 'register' && (
        <form onSubmit={handleRegister} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#1f2937', borderRadius: '8px' }}>
          <h3>Registro</h3>
          <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Nombre" style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: 'none', backgroundColor: '#374151', color: 'white' }} required />
          <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: 'none', backgroundColor: '#374151', color: 'white' }} required />
          <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Contraseña" style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: 'none', backgroundColor: '#374151', color: 'white' }} required />
          <label style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
            <input type="checkbox" checked={registerTerms} onChange={(e) => setRegisterTerms(e.target.checked)} required />
            <span style={{ marginLeft: '8px' }}>Acepto los términos</span>
          </label>
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px' }}>
            {isLoading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>
      )}
    </div>
  );
};

export default TestAuthContext;
