"use client";

import Link from "next/link";
import {
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { deleteUser } from "@/app/(admin)/admin/(protected)/users/actions";

type UserItem = {
  id: string;
  name: string;
  email: string;
  status: string;
  scope?: string | null;
  lastLoginAt?: string | null;
  role?: {
    name?: string;
    code?: string;
  } | null;
};

type Props = {
  users: UserItem[];
  role?: string;
};

export default function UsersTable({ users, role }: Props) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.name?.toLowerCase().includes(query) ||
        user.role?.code?.toLowerCase().includes(query) ||
        user.scope?.toLowerCase().includes(query) ||
        user.status?.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  return (
    <div className="bg-[#0B0A10] border border-ink-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-ink-800 flex flex-col sm:flex-row gap-4 justify-between bg-ink-900/20">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />

          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#07070B] border border-ink-800 rounded-lg pl-10 pr-4 py-2 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/users"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !role
                ? "bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20"
                : "bg-ink-900 border border-ink-800 text-ink-300"
            }`}
          >
            All
          </Link>

          <Link
            href="/admin/users?role=Super Admin"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              role === "Super Admin"
                ? "bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20"
                : "bg-ink-900 border border-ink-800 text-ink-300"
            }`}
          >
            Admin
          </Link>

          <Link
            href="/admin/users?role=Coordinator"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              role === "Coordinator"
                ? "bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20"
                : "bg-ink-900 border border-ink-800 text-ink-300"
            }`}
          >
            Manager
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-ink-900/50 border-b border-ink-800 text-ink-400 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Assigned Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-ink-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-ink-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              (() => {
                const roleTallies: Record<string, number> = {};

                return filteredUsers.map((user) => {
                  const roleName = user.role?.name ?? "No Role";

                  const totalWithRole = filteredUsers.filter(
                    (u) => (u.role?.name ?? "No Role") === roleName
                  ).length;

                  roleTallies[roleName] =
                    (roleTallies[roleName] || 0) + 1;

                  const displayRole =
                    totalWithRole > 1
                      ? `${roleName} ${roleTallies[roleName]}`
                      : roleName;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-ink-900/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vibeesta-500/20 to-shrinik-500/20 border border-ink-700 flex items-center justify-center text-ink-200 font-medium shrink-0">
                            {user.name?.charAt(0) || "U"}
                          </div>

                          <div>
                            <p className="font-medium text-ink-100">
                              {user.name}
                            </p>

                            <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-ink-200 bg-ink-900/50 w-fit px-2.5 py-1 rounded-md border border-ink-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-vibeesta-400" />
                            <span className="text-xs font-medium">
                              {displayRole}
                            </span>
                          </div>

                          {user.scope && user.scope !== "Global" && (
                            <div className="text-[11px] text-ink-500 font-medium px-1">
                              Assigned to: {user.scope}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${
                            user.status === "ACTIVE"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-ink-800 text-ink-400 border border-ink-700"
                          }`}
                        >
                          {user.status === "ACTIVE"
                            ? "Active"
                            : user.status === "DISABLED"
                              ? "Disabled"
                              : "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-ink-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {user.lastLoginAt
                            ? new Date(user.lastLoginAt).toLocaleString()
                            : "Never"}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="inline-flex p-2 text-ink-400 hover:text-vibeesta-400 hover:bg-vibeesta-500/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {user.role?.code !== "SUPER_ADMIN" && (
                            <form action={deleteUser.bind(null, user.id)}>
                              <button
                                type="submit"
                                className="inline-flex p-2 text-ink-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}