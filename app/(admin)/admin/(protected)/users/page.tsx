import {
  Plus,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getUsers, deleteUser } from "./actions";
import UsersTable from "@/components/admin/UsersTable";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    success?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const users = await getUsers(params.search);

  const filteredUsers = params.role
    ? users.filter((u: any) => u.role?.name === params.role)
    : users;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <h2 className="text-2xl font-display font-bold">
              User Management
            </h2>

            <p className="text-ink-400 text-sm mt-1">
              Manage admin users and assign their RBAC roles.
            </p>
          </div>
        </div>

        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Invite User
        </Link>
      </div>

      {params.success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              Action completed successfully.
            </p>
          </div>

          <Link
            href={
              params.role
                ? `/admin/users?role=${encodeURIComponent(params.role)}`
                : "/admin/users"
            }
            className="text-green-400 hover:text-green-300 px-2 py-1"
          >
            Dismiss
          </Link>
        </div>
      )}

      <UsersTable
        users={filteredUsers}
        role={params.role}
      />
    </div>
  );
}