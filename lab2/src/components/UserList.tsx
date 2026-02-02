import './UserList.css';

// BUG 2: Generic type constraint is too restrictive
// The generic constraint should allow objects with an id property
// Hint: Check what properties User actually has

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// ❌ BROKEN - Generic constraint is wrong


// ❌ BROKEN - Using wrong generic component
export function UserList({ users }: { users: User[] }) {
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <span className={`user-role user-role--${user.role}`}>
            {user.role}
          </span>
        </div>
      ))}
    </div>
  );
}
