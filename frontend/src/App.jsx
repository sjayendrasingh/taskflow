import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import BoardList from './components/BoardList';
import BoardView from './components/BoardView';

function AppContent() {
  const { user, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>Loading KanbanFlow...</div>
      </div>
    );
  }

  // If user is not authenticated
  if (!user) {
    return (
      <div className="app-container">
        {isRegister ? (
          <Register onToggleLogin={() => setIsRegister(false)} />
        ) : (
          <Login onToggleRegister={() => setIsRegister(true)} />
        )}
      </div>
    );
  }

  // If user is authenticated
  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onBackToDashboard={() => setSelectedBoardId(null)} />
      
      {selectedBoardId ? (
        <BoardView 
          boardId={selectedBoardId} 
          onBack={() => setSelectedBoardId(null)} 
        />
      ) : (
        <BoardList 
          onSelectBoard={(id) => setSelectedBoardId(id)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
