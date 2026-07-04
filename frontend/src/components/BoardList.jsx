import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Layout, ArrowRight, Trash2 } from 'lucide-react';

const BoardList = ({ onSelectBoard }) => {
  const { apiFetch } = useAuth();
  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBoards = async () => {
    try {
      const res = await apiFetch('/boards');
      if (res.ok) {
        const data = await res.json();
        setBoards(data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError('');

    try {
      const res = await apiFetch('/boards', {
        method: 'POST',
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        const board = await res.json();
        setBoards([board, ...boards]);
        setNewTitle('');
      } else {
        setError('Failed to create board');
      }
    } catch (err) {
      console.error(err);
      setError('Server error creating board');
    }
  };

  const handleDeleteBoard = async (boardId, e) => {
    e.stopPropagation(); // Avoid triggering onSelectBoard
    if (!window.confirm('Are you sure you want to delete this board and all its tasks?')) return;

    try {
      const res = await apiFetch(`/boards/${boardId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBoards(boards.filter(b => b._id !== boardId));
      } else {
        alert('Failed to delete board');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting board');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Your Boards</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Select a workspace or create a new board to start managing tasks</p>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Create Board Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderStyle: 'dashed',
          borderWidth: '2px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Create New Board</h3>
          <form onSubmit={handleCreateBoard}>
            <input
              type="text"
              className="form-control"
              placeholder="Board Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ marginBottom: '12px' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={18} /> Add Board
            </button>
          </form>
        </div>

        {/* Existing Boards */}
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading your boards...</p>
          </div>
        ) : boards.length === 0 ? (
          <div style={{
            gridColumn: '1/-1',
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            border: '1px dashed var(--border-color)'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>No boards created yet.</p>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Use the form on the left to create your first board!</p>
          </div>
        ) : (
          boards.map(board => (
            <div
              key={board._id}
              className="glass-card"
              onClick={() => onSelectBoard(board._id)}
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '8px',
                    borderRadius: '8px',
                    color: 'var(--accent-primary)'
                  }}>
                    <Layout size={20} />
                  </div>
                  {board.owner && board.owner._id === board.owner._id && (
                    <button
                      onClick={(e) => handleDeleteBoard(board._id, e)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {board.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  By {board.owner?.name || 'Unknown'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '14px' }}>
                Open Board <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BoardList;
