import React, { useState, useEffect } from 'react';
import { X, Calendar, User, AlertCircle, Trash2 } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, onDelete, task, boardMembers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssignedTo(task.assignedTo ? task.assignedTo._id || task.assignedTo : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setAssignedTo('');
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%', padding: '4px' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Task Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              className="form-control"
              placeholder="Add more details about this task..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Priority</label>
              <div style={{ position: 'relative' }}>
                <AlertCircle size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <select
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ paddingLeft: '44px', appearance: 'none', background: 'rgba(255,255,255,0.03)' }}
                >
                  <option value="low" style={{ background: 'var(--bg-secondary)' }}>Low</option>
                  <option value="medium" style={{ background: 'var(--bg-secondary)' }}>Medium</option>
                  <option value="high" style={{ background: 'var(--bg-secondary)' }}>High</option>
                </select>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Due Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Assign Member</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <select
                className="form-control"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{ paddingLeft: '44px', appearance: 'none', background: 'rgba(255,255,255,0.03)' }}
              >
                <option value="" style={{ background: 'var(--bg-secondary)' }}>Unassigned</option>
                {boardMembers.map(member => (
                  <option key={member._id} value={member._id} style={{ background: 'var(--bg-secondary)' }}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: task ? 'space-between' : 'flex-end',
            alignItems: 'center',
            marginTop: '30px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px'
          }}>
            {task && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDelete(task._id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
