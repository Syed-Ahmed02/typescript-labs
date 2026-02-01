import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';

interface UserProfileProps {
  user: User;
  onUpdateProfile?: (userId: string, data: Partial<User>) => void;
  isEditable?: boolean;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdateProfile,
  isEditable = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.profile.bio,
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.profile.bio || '',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateProfile!(user.id, {
      name: formData.name,
      email: formData.email,
      profile: {
        ...user.profile,
        bio: formData.bio,
      },
    });
    
    setIsEditing(false);
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return '#e74c3c';
      case 'user':
        return '#3498db';
      case 'guest':
        return '#95a5a6';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <div className={`user-profile ${className}`} style={styles.container}>
      <div style={styles.header}>
        <img
          src={user.profile.avatar}
          alt={user.name}
          style={styles.avatar}
        />
        <div style={styles.headerInfo}>
          <h2 style={styles.name}>{user.name}</h2>
          <span
            style={{
              ...styles.role,
              backgroundColor: getRoleColor(user.role),
            }}
          >
            {user.role}
          </span>
        </div>
        {isEditable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={styles.editButton}
            type="button"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="bio" style={styles.label}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={styles.textarea}
              rows={4}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={styles.info}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email:</span>
            <span style={styles.infoValue}>{user.email}</span>
          </div>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Bio:</span>
            <span style={styles.infoValue}>
              {user.profile.bio || 'No bio available'}
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Last Login:</span>
            <span style={styles.infoValue}>
              {formatDate(user.lastLogin)}
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Theme:</span>
            <span style={styles.infoValue}>
              {user.profile.preferences.theme}
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Language:</span>
            <span style={styles.infoValue}>
              {user.profile.preferences.language}
            </span>
          </div>

          <div style={styles.permissions}>
            <span style={styles.infoLabel}>Permissions:</span>
            <div style={styles.permissionTags}>
              {user.permissions.map((permission) => (
                <span key={permission} style={styles.permissionTag}>
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 600,
    color: '#2c3e50',
  },
  role: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#555',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: '14px',
    color: '#2c3e50',
  },
  permissions: {
    marginTop: '8px',
  },
  permissionTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  permissionTag: {
    padding: '4px 8px',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#555',
  },
};
