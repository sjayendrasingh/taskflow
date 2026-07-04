import React from 'react';
import { Calendar, AlignLeft, User } from 'lucide-react';

const TaskCard = ({ task, onDragStart, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low': return 'badge badge-low';
      case 'medium': return 'badge badge-medium';
      case 'high': return 'badge badge-high';
      default: return 'badge badge-medium';
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '16px',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority}
        </span>
      </div>

      <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 }}>
        {task.title}
      </h4>

      {task.description && (
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {task.description}
        </p>
      )}

      {/* Card Footer info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '12px',
        marginTop: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {task.description && (
            <div title="This task has a description" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <AlignLeft size={14} />
            </div>
          )}
          {task.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
              <Calendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {task.assignedTo ? (
          <div
            title={`Assigned to ${task.assignedTo.name}`}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 2px 6px var(--accent-glow)'
            }}
          >
            {task.assignedTo.name[0].toUpperCase()}
          </div>
        ) : (
          <div title="Unassigned" style={{ color: 'var(--text-muted)' }}>
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
