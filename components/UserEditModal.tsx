
import React, { useState, useEffect } from 'react';
import { User, MemorialPlan } from '../types';
import { useUsers } from '../hooks/useUsers';

interface UserEditModalProps {
  user: User | null;
  onClose: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose }) => {
  const [plan, setPlan] = useState<MemorialPlan>('free');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const { updateUser } = useUsers();

  useEffect(() => {
    if (user) {
      setPlan(user.plan);
      setRole(user.role || 'user');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, { plan, role });
    onClose();
  };
  
  const inputStyles = "mt-1 block w-full rounded-md bg-pale-sky border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
  const labelStyles = "block text-sm font-medium text-deep-navy/90";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-serif font-bold text-deep-navy mb-4">Edit User: {user.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="plan" className={labelStyles}>Plan</label>
            <select
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as MemorialPlan)}
              className={inputStyles}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="eternal">Eternal</option>
            </select>
          </div>
          <div>
            <label htmlFor="role" className={labelStyles}>Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className={inputStyles}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-silver hover:bg-soft-gray/80 text-deep-navy font-bold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
