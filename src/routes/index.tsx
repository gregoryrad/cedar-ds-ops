import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GitBranch, TrendingUp, UserPlus, AlertTriangle, Package, Activity } from "lucide-react";
import { Card, Badge, Spinner, Avatar, Divider } from "@/cedar";
import { adoptionTrend, recentActivity } from "@/lib/cedar-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Cedar Ops" },
      { name: "description", content: "At-a-glance metrics and adoption trends for the Cedar design system." },
    ],
  }),
  component: Overview,
});

const metrics = [
  { label: "Total Components", value: "23", note: "in the Cedar library" },
  { label: "Avg Adoption", value: "78%", note: "across tracked products" },
  { label: "Products Tracked", value: "4", note: "active integrations" },
  { label: "Active Contributors", value: "6", note: "this quarter" },
];

function activityIcon(type: string) {
  const s = 16;
  switch (type) {
    case "update": return <GitBranch size={s} />;
    case "milestone": return <TrendingUp size={s} />;
    case "product": return <Package size={s} />;
    case "contributor": return <UserPlus size={s} />;
    case "breaking": return <AlertTriangle size={s} />;
    default: return <Activity size={s} />;
  }
}

function activityBadgeColor(type: string): "error" | "warning" | "information" | "default" {
  if (type === "breaking") return "error";
  if (type === "milestone") return "information";
  if (type === "update") return "default";
  return "default";
}

function Overview() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 style={{ fontSize: 'var(--title-md)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Overview</h1>
        <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>Cedar design system adoption at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} style={{ padding: 'var(--space-5)' }}>
            <div style={{ fontSize: 'var(--size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{m.label}</div>
            <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--title-lg)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>{m.value}</div>
            <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{m.note}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" style={{ padding: 'var(--space-6)' }} cardStyle="default">
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Adoption trend</h2>
              <p style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', margin: 0 }}>Last 6 months</p>
            </div>
            <span style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>%</span>
          </div>
          <div style={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adoptionTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cedarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--action-primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--action-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-subtle)" fontSize={12} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-base)' }} />
                <Area type="monotone" dataKey="adoption" stroke="var(--action-primary)" strokeWidth={2} fill="url(#cedarGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ padding: 'var(--space-6)' }} cardStyle="default">
          <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: '0 0 var(--space-4) 0' }}>Recent activity</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {recentActivity.map((a, idx) => (
              <li key={a.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <Avatar
                    size="sm"
                    icon={activityIcon(a.type)}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--body-sm)', color: 'var(--text-base)', fontFamily: 'var(--font-base)', lineHeight: 1.4 }}>{a.text}</div>
                    <div style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{a.time}</span>
                      {a.type === "breaking" && <Badge color="error" badgeStyle="subtle" size="sm">Breaking</Badge>}
                      {a.type === "milestone" && <Badge color="information" badgeStyle="subtle" size="sm">Milestone</Badge>}
                    </div>
                  </div>
                </div>
                {idx < recentActivity.length - 1 && (
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <Divider variant="subtle" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
