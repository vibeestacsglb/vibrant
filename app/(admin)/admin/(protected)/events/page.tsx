import { Plus, Search, Filter, Edit2, Trash2, ArrowLeft, CheckCircle, Calendar as CalendarIcon, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { getEvents, deleteEvent } from "./actions"
import { requirePermission } from "@/lib/auth/authorize";
import EventsTable from "@/components/admin/EventsTable";

export default async function AdminEventsPage({ searchParams }: { searchParams: { success?: string, category?: string } }) {
  const params = await searchParams;
  let events = await getEvents();
  const admin = await requirePermission("events.view");
  
  if (params.category) {
    events = events.filter((e: any) => e.category === params.category);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">Events</h2>
            <p className="text-ink-400 text-sm mt-1">Manage fest events, schedules, and capacities.</p>
          </div>
        </div>
        
        <Link href="/admin/events/new" className="flex items-center gap-2 bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      {params.success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Action completed successfully.</p>
           </div>
           <Link href={`/admin/events${params.category ? `?category=${params.category}` : ''}`} className="text-green-400 hover:text-green-300 px-2 py-1">
             Dismiss
           </Link>
        </div>
      )}

      <EventsTable events={events} category={params.category} />
      <div className="flex gap-2">
    <Link
      href="/admin/events"
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        !params.category
          ? "bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20"
          : "bg-ink-900 border border-ink-800 text-ink-300"
      }`}
    >
      All
    </Link>

    <Link
      href="/admin/events?category=tech"
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        params.category === "tech"
          ? "bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20"
          : "bg-ink-900 border border-ink-800 text-ink-300"
      }`}
    >
      Tech
    </Link>

    <Link
      href="/admin/events?category=creative"
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        params.category === "creative"
          ? "bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20"
          : "bg-ink-900 border border-ink-800 text-ink-300"
      }`}
    >
      Creative
    </Link>
  </div>
    </div>
  )
}