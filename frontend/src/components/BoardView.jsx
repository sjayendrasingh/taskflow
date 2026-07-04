import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, ArrowLeft, MoreHorizontal, Settings, Users, Calendar, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const BoardView = ({ boardId, onBack }) => {
  const { apiFetch, user } = useAuth();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumn, setTargetColumn] = useState('To-Do');
  
  // Board member addition state
  const [showMemberInput, setShowMemberInput] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');

  const fetchBoardData = async () => {
    try {
      const boardRes = await apiFetch(`/boards/${boardId}`);
      if (!boardRes.ok) throw new Error('Failed to load board details');
      const boardData = await boardRes.json();
      setBoard(boardData);

      const tasksRes = await apiFetch(`/tasks/board/${boardId}`);
      if (!tasksRes.ok) throw new Error('Failed to load tasks');
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    // Optimistically update frontend state
    const originalTasks = [...tasks];
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, status: targetStatus } : task
      )
    );

    try {
      const res = await apiFetch(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!res.ok) {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error('Drag and drop error:', err);
      // Revert state on error
      setTasks(originalTasks);
    }
  };

  // Task Actions
  const handleOpenAddTask = (column) => {
    setEditingTask(null);
    setTargetColumn(column);
    setIsModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Edit existing task
        const res = await apiFetch(`/tasks/${editingTask._id}`, {
          method: 'PUT',
          body: JSON.stringify(taskData),
        });
        if (res.ok) {
          const updatedTask = await res.json();
          setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        }
      } else {
        // Create new task
        const res = await apiFetch('/tasks', {
          method: 'POST',
          body: JSON.stringify({
            ...taskData,
            status: targetColumn,
            boardId,
          }),
        });
        if (res.ok) {
          const newTask = await res.json();
          setTasks(prev => [...prev, newTask]);
        }
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert('Error saving task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await apiFetch(`/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  // Member Management
  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    if (!memberEmail.trim()) return;

    try {
      // Step 1: Find users to verify email or search in backend. Let's do request to auth users.
      const usersRes = await apiFetch('/auth/users');
      if (!usersRes.ok) throw new Error();
      const allUsers = await usersRes.json();
      const targetUser = allUsers.find(u => u.email.toLowerCase() === memberEmail.toLowerCase().trim());

      if (!targetUser) {
        setMemberError('User with this email not found');
        return;
      }

      if (board.owner._id === targetUser._id || board.members.some(m => m._id === targetUser._id)) {
        setMemberError('User is already a member or owner');
        return;
      }

      // Step 2: Add member ID to board
      const updatedMembers = [...board.members.map(m => m._id), targetUser._id];
      const res = await apiFetch(`/boards/${boardId}`, {
        method: 'PUT',
        body: JSON.stringify({ members: updatedMembers }),
      });

      if (res.ok) {
        const updatedBoard = await res.json();
        setBoard(updatedBoard);
        setMemberEmail('');
        setShowMemberInput(false);
      } else {
        setMemberError('Failed to add member');
      }
    } catch (err) {
      console.error(err);
      setMemberError('Error adding member');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading board...</p>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
        <p style={{ color: '#f87171', marginBottom: '20px' }}>{error || 'Board not found'}</p>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 32px 40px 32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Board Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <button className="btn btn-secondary" onClick={onBack} style={{ padding: '6px 12px', fontSize: '13px', marginBottom: '16px', borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', lineHeight: 1.2 }}>{board.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Owner: {board.owner.name}
          </p>
        </div>

        {/* Board Members Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', marginRight: '-8px' }}>
              {/* Owner Avatar */}
              <div 
                title={`${board.owner.name} (Owner)`} 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: '2px solid var(--bg-primary)'
                }}
              >
                {board.owner.name[0].toUpperCase()}
              </div>
              {/* Member Avatars */}
              {board.members.map((member) => (
                <div 
                  key={member._id}
                  title={member.name} 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: '2px solid var(--bg-primary)',
                    marginLeft: '-8px'
                  }}
                >
                  {member.name[0].toUpperCase()}
                </div>
              ))}
            </div>

            {board.owner._id === user.id && (
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowMemberInput(!showMemberInput)}
                style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}
              >
                <Users size={14} /> Invite
              </button>
            )}
          </div>

          {showMemberInput && (
            <form onSubmit={handleAddMember} className="glass-panel" style={{
              position: 'absolute',
              right: '32px',
              top: '160px',
              padding: '16px',
              zIndex: 100,
              width: '260px',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Invite Collaborator</label>
              <input
                type="email"
                placeholder="User email"
                className="form-control"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                style={{ fontSize: '13px', padding: '8px 12px', marginBottom: '8px' }}
                required
              />
              {memberError && <p style={{ color: '#ef4444', fontSize: '11px', marginBottom: '8px' }}>{memberError}</p>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', flex: 1 }}>Add</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMemberInput(false)} style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Board Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        alignItems: 'start',
        flex: 1
      }}>
        {board.columns.map(col => {
          const colTasks = tasks.filter(task => task.status === col);
          
          let statusColor = 'var(--status-todo)';
          if (col === 'Doing') statusColor = 'var(--status-doing)';
          if (col === 'Done') statusColor = 'var(--status-done)';

          return (
            <div 
              key={col} 
              className="glass-panel"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
              style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.01)',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    boxShadow: `0 0 8px ${statusColor}`
                  }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{col}</h3>
                  <span style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    {colTasks.length}
                  </span>
                </div>
                <button 
                  className="btn" 
                  onClick={() => handleOpenAddTask(col)}
                  style={{
                    padding: '4px',
                    color: 'var(--text-secondary)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Column Content / Tasks */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flex: 1,
                overflowY: 'auto'
              }}>
                {colTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    onClick={() => handleOpenEditTask(task)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          task={editingTask}
          boardMembers={[board.owner, ...board.members]}
        />
      )}
    </div>
  );
};

export default BoardView;
