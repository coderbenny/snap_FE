'use client';

import { useState, useEffect } from 'react';
import { Loader2, Users, Plus, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import TeamMembers from './team-members';
import TeamSnippets from './team-snippets';

const TABS = [
  { id: 'members', label: 'Members' },
  { id: 'snippets', label: 'Snippets' },
];

function CreateTeamForm({ onCreate }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create team'); return; }
      onCreate(data);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Users className="size-6 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-foreground">Create your team</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share encrypted snippets and collaborate with your team.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-1.5">
          <Label htmlFor="team-name">Team name</Label>
          <Input
            id="team-name"
            placeholder="e.g. Acme Engineering"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Create team
        </Button>
      </form>
    </div>
  );
}

export default function TeamDashboard({ userId }) {
  const [viewState, setViewState] = useState('loading'); // loading | upgrade | no-team | ready
  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    async function init() {
      const res = await fetch('/api/teams');
      if (res.status === 403) { setViewState('upgrade'); return; }
      if (!res.ok) { setViewState('no-team'); return; }
      const data = await res.json();
      const list = data.teams || [];
      setTeams(list);
      if (list.length === 0) {
        setViewState('no-team');
      } else {
        setSelectedId(list[0].id);
        setViewState('ready');
      }
    }
    init();
  }, []);

  function handleTeamCreated(team) {
    setTeams([team]);
    setSelectedId(team.id);
    setViewState('ready');
  }

  const selectedTeam = teams.find((t) => t.id === selectedId);

  // ── States ─────────────────────────────────────────────────────────────────

  if (viewState === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (viewState === 'upgrade') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Zap className="size-6 text-primary" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-foreground">Team plan required</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Upgrade to the Team plan to create a team, invite members, and share encrypted snippets.
        </p>
        <Button className="mt-5" asChild>
          <Link href="/billing">Upgrade to Team</Link>
        </Button>
      </div>
    );
  }

  if (viewState === 'no-team') {
    return <CreateTeamForm onCreate={handleTeamCreated} />;
  }

  // ── Ready ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Team selector (if multiple teams) + header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {teams.length > 1 ? (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          ) : (
            <h2 className="text-lg font-semibold text-foreground">{selectedTeam?.name}</h2>
          )}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
            {selectedTeam?.role}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => { setTeams([]); setViewState('no-team'); }}
        >
          <Plus className="mr-1.5 size-3.5" />
          New team
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'members' && selectedTeam && (
        <TeamMembers
          teamId={selectedId}
          currentUserId={userId}
          currentRole={selectedTeam.role}
        />
      )}
      {activeTab === 'snippets' && (
        <TeamSnippets teamId={selectedId} currentUserId={userId} />
      )}
    </div>
  );
}
