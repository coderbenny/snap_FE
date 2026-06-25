'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { UserPlus, Loader2, Copy, Check, Crown, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ROLE_ICONS = { owner: Crown, admin: Shield, member: User };
const ROLE_COLORS = { owner: 'text-yellow-500', admin: 'text-blue-500', member: 'text-muted-foreground' };

function RoleBadge({ role }) {
  const Icon = ROLE_ICONS[role] || User;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium capitalize ${ROLE_COLORS[role]}`}>
      <Icon className="size-3" />
      {role}
    </span>
  );
}

export default function TeamMembers({ teamId, currentUserId, currentRole }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteToken, setInviteToken] = useState(null);
  const [inviteError, setInviteError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/teams/${teamId}/members`)
      .then((r) => r.json())
      .then((d) => setMembers(d.members || []))
      .finally(() => setLoading(false));
  }, [teamId]);

  async function handleInvite(e) {
    e.preventDefault();
    setInviteError('');
    setInviteToken(null);
    setInviting(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setInviteError(data.error || 'Invite failed'); return; }
      setInviteToken(data.invite_token);
      setEmail('');
    } catch {
      setInviteError('Something went wrong. Try again.');
    } finally {
      setInviting(false);
    }
  }

  const inviteLink =
    inviteToken &&
    `${typeof window !== 'undefined' ? window.location.origin : ''}/team/join?token=${inviteToken}`;

  async function copyInviteLink() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const canInvite = currentRole === 'owner' || currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Member list */}
      <div className="overflow-hidden rounded-xl border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Member</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.user_id} className="bg-card">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {m.email}
                    {m.user_id === currentUserId && (
                      <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={m.role} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(m.joined_at), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite form */}
      {canInvite && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserPlus className="size-4" />
            Invite a member
          </h3>

          <form onSubmit={handleInvite} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="invite-email" className="sr-only">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={inviting}>
              {inviting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Send invite
            </Button>
          </form>

          {inviteError && (
            <p className="mt-2 text-sm text-destructive">{inviteError}</p>
          )}

          {inviteToken && (
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
              <p className="mb-2 text-xs text-muted-foreground">
                Email delivery isn&apos;t configured yet — share this link directly with the invitee:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs text-foreground">
                  {inviteLink}
                </code>
                <button
                  onClick={copyInviteLink}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                >
                  {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">Expires in 7 days.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
