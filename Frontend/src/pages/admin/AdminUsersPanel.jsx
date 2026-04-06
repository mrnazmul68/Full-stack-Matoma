import React, { useState } from 'react';
import {
  FiClock,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCcw,
  FiSearch,
  FiTrash2,
  FiUnlock,
  FiUsers,
} from 'react-icons/fi';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
});

const formatDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return dateFormatter.format(date);
};

const getDonorLabel = (status) => {
  if (status === 'donor') {
    return 'Donor';
  }

  if (status === 'non-donor') {
    return 'Non-Donor';
  }

  return 'Not set';
};

const getUserSearchText = (user) =>
  [
    user.name,
    user.email,
    user.mobile,
    user.upozila,
    user.bloodGroup,
    user.isBlocked ? 'blocked' : 'active',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const AdminUsersPanel = ({
  users,
  isLoading = false,
  isRefreshing = false,
  activeAction = null,
  onRefresh,
  onDeleteUser,
  onToggleUserBlock,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredUsers = users.filter((user) => getUserSearchText(user).includes(normalizedSearch));
  const donorCount = users.filter((user) => user.isDonor === 'donor').length;
  const profileCount = users.filter(
    (user) => user.mobile || user.upozila || user.bloodGroup || user.age,
  ).length;

  return (
    <section className="rounded-[32px] border border-red-900/40 bg-[#0b0a0abf] p-5 shadow-[0_0_28px_rgba(255,0,0,0.12)] backdrop-blur-md sm:p-6 md:p-8">
      <div className="flex flex-col gap-5 border-b border-red-900/25 pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white md:text-[30px]">Registered Users</h2>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || isRefreshing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[tomato] hover:text-[tomato] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
        >
          <FiRefreshCcw size={16} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Users'}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-white/8 bg-black/30 p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#888]">
            Total Users
          </p>
          <p className="mt-3 text-3xl font-black text-white">{users.length}</p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-black/30 p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#888]">
            Donor Profiles
          </p>
          <p className="mt-3 text-3xl font-black text-white">{donorCount}</p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-black/30 p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#888]">
            Filled Profiles
          </p>
          <p className="mt-3 text-3xl font-black text-white">{profileCount}</p>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="admin-user-search"
          className="mb-3 block text-[11px] font-black uppercase tracking-[0.26em] text-[#9f9f9f]"
        >
          Search Users
        </label>
        <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-black/30 px-4 py-3">
          <FiSearch size={16} className="text-[tomato]" />
          <input
            id="admin-user-search"
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by name, email, phone, upazila, or blood group"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#8e8e8e]">
          {filteredUsers.length} result{filteredUsers.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="rounded-[24px] border border-white/8 bg-black/30 p-6 text-center text-sm text-slate-300">
            Loading registered users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-[24px] border border-white/8 bg-black/30 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[tomato]/30 bg-[rgba(255,99,71,0.1)] text-[tomato]">
              <FiUsers size={22} />
            </div>
            <p className="mt-4 text-lg font-semibold text-white">
              {users.length === 0 ? 'No users found yet.' : 'No users match this search.'}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {users.length === 0
                ? 'Newly registered accounts will appear here automatically.'
                : 'Try a different keyword to find the user you are looking for.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className={`rounded-[28px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5 shadow-[0_0_18px_rgba(255,0,0,0.08)] ${
                  user.isBlocked ? 'border-red-500/35' : 'border-white/8'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[tomato]/30 bg-[rgba(255,99,71,0.1)] text-lg font-black uppercase text-[tomato]">
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name?.slice(0, 1) || 'U'
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{user.name || 'Unnamed User'}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <p className="inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#cfcfcf]">
                          {getDonorLabel(user.isDonor)}
                        </p>
                        <p
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${
                            user.isBlocked
                              ? 'border-red-500/40 bg-red-500/10 text-red-300'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full border border-[tomato]/25 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[tomato]">
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <FiMail size={16} className="mt-0.5 shrink-0 text-[tomato]" />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                        Email
                      </p>
                      <p className="mt-1 break-all text-white">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                      <FiPhone size={16} className="mt-0.5 shrink-0 text-[tomato]" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                          Mobile
                        </p>
                        <p className="mt-1 text-white">{user.mobile || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                      <FiMapPin size={16} className="mt-0.5 shrink-0 text-[tomato]" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                          Upazila
                        </p>
                        <p className="mt-1 text-white">{user.upozila || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                        Blood Group
                      </p>
                      <p className="mt-2 text-white">{user.bloodGroup || 'Not set'}</p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                        Age
                      </p>
                      <p className="mt-2 text-white">{user.age || 'Not set'}</p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                        Donated
                      </p>
                      <p className="mt-2 text-white">{user.donated ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8d8d8d]">
                      Last Updated
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-white">
                      <FiClock size={15} className="text-[tomato]" />
                      <span>{formatDate(user.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => onToggleUserBlock(user)}
                    disabled={activeAction?.userId === user.id}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${
                      user.isBlocked
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                        : 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    }`}
                  >
                    {user.isBlocked ? <FiUnlock size={15} /> : <FiLock size={15} />}
                    {activeAction?.userId === user.id && activeAction?.type === 'block'
                      ? 'Please wait...'
                      : user.isBlocked
                        ? 'Unblock User'
                        : 'Block User'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteUser(user)}
                    disabled={activeAction?.userId === user.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors duration-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    <FiTrash2 size={15} />
                    {activeAction?.userId === user.id && activeAction?.type === 'delete'
                      ? 'Removing...'
                      : 'Remove User'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminUsersPanel;
