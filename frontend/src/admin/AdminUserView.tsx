import React, { useState, useEffect } from 'react';
import { Search, Users, CheckCircle2, Ban, Shield, ChevronDown, UserCog, RefreshCw, Power, Radio } from 'lucide-react';

interface UserRecord {
  id: number;
  userId: string;
  email: string;
  role: string;
  rawRole: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  barangay: string;
  city: string;
  status: string;
  isOnline: boolean;
  presence: 'Online' | 'Offline';
  createdAt: string;
}

export const AdminUserView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [presenceFilter, setPresenceFilter] = useState<string>('All Presences');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Poll every 3 seconds for live real-time presence updates
    const interval = setInterval(fetchUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = async (user: UserRecord) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setUpdatingId(user.id);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phoneNumber.toLowerCase().includes(q) ||
      u.userId.toLowerCase().includes(q);

    const matchesRole =
      roleFilter === 'All Roles' ||
      (roleFilter === 'Administrator' && (u.rawRole === 'admin' || u.role === 'Administrator')) ||
      (roleFilter === 'User / Beneficiary' && (u.rawRole === 'user' || u.role === 'User / Beneficiary')) ||
      (roleFilter === 'Social Worker' && u.rawRole === 'social_worker');

    const matchesPresence =
      presenceFilter === 'All Presences' ||
      (presenceFilter === 'Online' && u.isOnline) ||
      (presenceFilter === 'Offline' && !u.isOnline);

    return matchesSearch && matchesRole && matchesPresence;
  });

  // Metric Stats
  const totalCount = users.length;
  const onlineCount = users.filter((u) => u.isOnline).length;
  const offlineCount = users.filter((u) => !u.isOnline).length;
  const adminCount = users.filter((u) => u.rawRole === 'admin' || u.role === 'Administrator').length;

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            User Management
          </h1>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e1726] border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#121c2e] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Live Sync</span>
        </button>
      </div>

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL USERS</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{totalCount}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Registered citizen accounts</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">ONLINE USERS</span>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight mt-2">{onlineCount}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Currently logged in & active</span>
          </div>
          <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">OFFLINE USERS</span>
            <div className="text-3xl font-extrabold text-slate-400 tracking-tight mt-2">{offlineCount}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Logged out / Inactive session</span>
          </div>
          <div className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
            <Ban className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">ADMINISTRATORS</span>
            <div className="text-3xl font-extrabold text-purple-400 tracking-tight mt-2">{adminCount}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">System administration roles</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by full name, email, contact number, or User ID (USR-...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Account Role:</span>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Administrator">Administrator</option>
                  <option value="User / Beneficiary">User / Beneficiary</option>
                  <option value="Social Worker">Social Worker</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Presence Status:</span>
              <div className="relative">
                <select
                  value={presenceFilter}
                  onChange={(e) => setPresenceFilter(e.target.value)}
                  className="appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="All Presences">All Presences</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            Showing <strong className="text-slate-200">{filteredUsers.length}</strong> of <strong className="text-slate-200">{users.length}</strong> registered accounts
          </div>
        </div>
      </div>

      {/* Registered Accounts List Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Registered Accounts <span className="text-slate-400 font-mono text-xs">({filteredUsers.length})</span>
        </h3>

        {filteredUsers.length === 0 ? (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
              <UserCog className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-extrabold text-white">No registered accounts found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or role filters.</p>
          </div>
        ) : (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1220] border-b border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">USER ID</th>
                    <th className="px-5 py-3.5">FULL NAME</th>
                    <th className="px-5 py-3.5">EMAIL & CONTACT</th>
                    <th className="px-5 py-3.5">ROLE</th>
                    <th className="px-5 py-3.5">PRESENCE STATUS</th>
                    <th className="px-5 py-3.5 text-right">ACCESS CONTROL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#121c2e]/60 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {u.userId}
                      </td>
                      <td className="px-5 py-4 text-white font-semibold">
                        <div>{u.name}</div>
                        {u.barangay && u.barangay !== 'N/A' && (
                          <span className="text-[10px] font-normal text-slate-400">Brgy. {u.barangay}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        <div className="font-mono text-slate-200">{u.email}</div>
                        <div className="text-[10px] text-slate-400">{u.phoneNumber}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                          u.rawRole === 'admin'
                            ? 'bg-purple-950/80 border border-purple-500/40 text-purple-300'
                            : 'bg-blue-950/80 border border-blue-500/40 text-blue-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.isOnline
                            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border border-slate-700/80 text-slate-400'
                        }`}>
                          {u.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={updatingId === u.id}
                          title={u.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            u.status === 'Active'
                              ? 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
                              : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
                          } ${updatingId === u.id ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
