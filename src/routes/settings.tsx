import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InputField, Select, Toggle, Checkbox, RadioGroup, Button, Modal, Avatar, Divider, Card, useToast } from "@/cedar";
import type { RadioOption } from "@/cedar";
import { teamMembers, products } from "@/lib/cedar-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cedar Ops" },
      { name: "description", content: "Configure your Cedar Ops team, products, and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

const reportFrequencyOptions: RadioOption[] = [
  { value: "weekly", label: "Weekly", description: "Get a digest every Monday morning" },
  { value: "biweekly", label: "Bi-weekly", description: "Every other Monday" },
  { value: "monthly", label: "Monthly", description: "First Monday of each month" },
];

function SettingsPage() {
  const { toast } = useToast();

  const [teamName, setTeamName] = useState("Cedar Design System Team");
  const [defaultProduct, setDefaultProduct] = useState(products[0]);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [notifyUpdates, setNotifyUpdates] = useState(true);
  const [notifyBreaking, setNotifyBreaking] = useState(true);
  const [notifyMilestones, setNotifyMilestones] = useState(false);
  const [reportFrequency, setReportFrequency] = useState("weekly");
  const [resetModalOpen, setResetModalOpen] = useState(false);

  function handleSave() {
    toast({ variant: "success", title: "Settings saved", message: "Your preferences have been updated." });
  }

  function handleResetConfirm() {
    setTeamName("Cedar Design System Team");
    setDefaultProduct(products[0]);
    setTrackingEnabled(true);
    setNotifyUpdates(true);
    setNotifyBreaking(true);
    setNotifyMilestones(false);
    setReportFrequency("weekly");
    setResetModalOpen(false);
    toast({ variant: "information", title: "Settings reset", message: "All settings have been restored to defaults." });
  }

  const productOptions = products.map((p) => ({ value: p, label: p }));

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--title-md)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Settings</h1>
        <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>Manage your team, tracked products, and notification preferences.</p>
      </div>

      <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Team configuration</h2>
          <p style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', marginTop: 'var(--space-1)', marginBottom: 0 }}>Set up your team name and default product tracking.</p>
        </div>
        <Divider variant="subtle" />
        <InputField
          label="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          inputSize="md"
        />
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--text-base)' }}>Default product</label>
          <Select value={defaultProduct} onChange={setDefaultProduct} options={productOptions} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', backgroundColor: 'var(--bg-faint)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>Enable adoption tracking</div>
            <div style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>Track component usage across all products in real time</div>
          </div>
          <Toggle checked={trackingEnabled} onChange={setTrackingEnabled} />
        </div>
      </Card>

      <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Team members</h2>
          <p style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', marginTop: 'var(--space-1)', marginBottom: 0 }}>People with access to Cedar Ops.</p>
        </div>
        <Divider variant="subtle" />
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {teamMembers.map((m) => (
            <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-faint)' }}>
              <Avatar name={m.name} size="sm" status={m.active ? "online" : "offline"} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>{m.name}</div>
                <div style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{m.role}</div>
              </div>
              <span style={{ fontSize: 'var(--size-xs)', color: m.active ? 'var(--status-success)' : 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>{m.active ? "Active" : "Inactive"}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)', margin: 0 }}>Notifications</h2>
          <p style={{ fontSize: 'var(--size-xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)', marginTop: 'var(--space-1)', marginBottom: 0 }}>Choose which events trigger a notification.</p>
        </div>
        <Divider variant="subtle" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Checkbox checked={notifyUpdates} onChange={setNotifyUpdates} label="Component updates" description="When a Cedar component releases a new version" />
          <Checkbox checked={notifyBreaking} onChange={setNotifyBreaking} label="Breaking changes" description="When a breaking change is published" />
          <Checkbox checked={notifyMilestones} onChange={setNotifyMilestones} label="Adoption milestones" description="When a component reaches a new adoption threshold" />
        </div>
        <Divider variant="subtle" />
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-3)', fontFamily: 'var(--font-base)', fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--text-base)' }}>Report frequency</label>
          <RadioGroup name="report-frequency" value={reportFrequency} onChange={setReportFrequency} options={reportFrequencyOptions} layout="vertical" />
        </div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Button variant="outlined" color="destructive" onClick={() => setResetModalOpen(true)}>Reset to defaults</Button>
        <Button variant="filled" color="brand" onClick={handleSave}>Save settings</Button>
      </div>

      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset all settings?"
        description="This will restore all settings to their defaults. This action cannot be undone."
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button variant="ghost" color="neutral" onClick={() => setResetModalOpen(false)}>Cancel</Button>
            <Button variant="filled" color="destructive" onClick={handleResetConfirm}>Reset</Button>
          </div>
        }
      />
    </div>
  );
}
