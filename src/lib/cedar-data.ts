export type ComponentStatus = "Stable" | "Beta" | "Deprecated";
export type ComponentCategory =
  | "Inputs"
  | "Data Display"
  | "Feedback"
  | "Navigation"
  | "Status"
  | "Overlays";

export interface CedarComponent {
  slug: string;
  name: string;
  category: ComponentCategory;
  status: ComponentStatus;
  adoption: number;
  variants: number | string;
  updated: string;
  updatedDays: number;
}

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const raw: Omit<CedarComponent, "slug">[] = [
  { name: "Button", category: "Inputs", status: "Stable", adoption: 95, variants: 72, updated: "2 days ago", updatedDays: 2 },
  { name: "Input Field", category: "Inputs", status: "Stable", adoption: 92, variants: 75, updated: "1 week ago", updatedDays: 7 },
  { name: "Form Field", category: "Inputs", status: "Stable", adoption: 88, variants: 15, updated: "1 week ago", updatedDays: 7 },
  { name: "Checkbox", category: "Inputs", status: "Stable", adoption: 85, variants: 54, updated: "3 days ago", updatedDays: 3 },
  { name: "Radio", category: "Inputs", status: "Stable", adoption: 82, variants: 45, updated: "2 weeks ago", updatedDays: 14 },
  { name: "Toggle", category: "Inputs", status: "Stable", adoption: 80, variants: 36, updated: "1 week ago", updatedDays: 7 },
  { name: "Select", category: "Inputs", status: "Stable", adoption: 78, variants: 48, updated: "5 days ago", updatedDays: 5 },
  { name: "Icon Button", category: "Inputs", status: "Stable", adoption: 76, variants: 12, updated: "2 weeks ago", updatedDays: 14 },
  { name: "Badge", category: "Data Display", status: "Stable", adoption: 88, variants: 36, updated: "4 days ago", updatedDays: 4 },
  { name: "Chip", category: "Data Display", status: "Stable", adoption: 84, variants: 72, updated: "1 week ago", updatedDays: 7 },
  { name: "Card", category: "Data Display", status: "Stable", adoption: 90, variants: 3, updated: "3 days ago", updatedDays: 3 },
  { name: "Avatar", category: "Data Display", status: "Stable", adoption: 72, variants: 5, updated: "3 weeks ago", updatedDays: 21 },
  { name: "Divider", category: "Data Display", status: "Stable", adoption: 70, variants: 2, updated: "1 month ago", updatedDays: 30 },
  { name: "Data Grid", category: "Data Display", status: "Beta", adoption: 45, variants: "Complex", updated: "1 day ago", updatedDays: 1 },
  { name: "Alert", category: "Feedback", status: "Stable", adoption: 86, variants: 4, updated: "1 week ago", updatedDays: 7 },
  { name: "Toast", category: "Feedback", status: "Stable", adoption: 75, variants: 4, updated: "5 days ago", updatedDays: 5 },
  { name: "Modal", category: "Feedback", status: "Stable", adoption: 68, variants: 3, updated: "2 weeks ago", updatedDays: 14 },
  { name: "Tooltip", category: "Feedback", status: "Stable", adoption: 65, variants: 4, updated: "2 weeks ago", updatedDays: 14 },
  { name: "Tabs", category: "Navigation", status: "Stable", adoption: 82, variants: 3, updated: "4 days ago", updatedDays: 4 },
  { name: "Breadcrumb", category: "Navigation", status: "Stable", adoption: 58, variants: 3, updated: "3 weeks ago", updatedDays: 21 },
  { name: "Pagination", category: "Navigation", status: "Stable", adoption: 55, variants: 3, updated: "2 weeks ago", updatedDays: 14 },
  { name: "Menu", category: "Overlays", status: "Stable", adoption: 60, variants: 7, updated: "1 week ago", updatedDays: 7 },
  { name: "Progress Bar", category: "Status", status: "Stable", adoption: 73, variants: 3, updated: "2 weeks ago", updatedDays: 14 },
  { name: "Spinner", category: "Status", status: "Stable", adoption: 70, variants: 3, updated: "3 weeks ago", updatedDays: 21 },
];

export const components: CedarComponent[] = raw.map((c) => ({ ...c, slug: slugify(c.name) }));

export const categories: ComponentCategory[] = [
  "Inputs",
  "Data Display",
  "Feedback",
  "Navigation",
  "Status",
  "Overlays",
];

export const adoptionTrend = [
  { month: "Jan", adoption: 55 },
  { month: "Feb", adoption: 60 },
  { month: "Mar", adoption: 65 },
  { month: "Apr", adoption: 69 },
  { month: "May", adoption: 74 },
  { month: "Jun", adoption: 78 },
];

export const recentActivity = [
  { id: 1, type: "update", text: "Button updated to v2.3", time: "2 hours ago" },
  { id: 2, type: "milestone", text: "Toast component reached 90% adoption", time: "5 hours ago" },
  { id: 3, type: "product", text: "Cedar Ops added as tracked product", time: "1 day ago" },
  { id: 4, type: "contributor", text: "New contributor: Sarah Chen", time: "2 days ago" },
  { id: 5, type: "update", text: "Data Grid moved to Beta", time: "3 days ago" },
  { id: 6, type: "breaking", text: "Breaking change published for Modal v3.0", time: "4 days ago" },
  { id: 7, type: "milestone", text: "Card reached 90% adoption in DayLog", time: "6 days ago" },
  { id: 8, type: "contributor", text: "New contributor: Miguel Alvarez", time: "1 week ago" },
];

export const products = ["DayLog", "Cedar Docs", "Cedar Ops", "Client Portal"];

export const productAdoption = [
  { product: "DayLog", adoption: 100 },
  { product: "Cedar Docs", adoption: 85 },
  { product: "Cedar Ops", adoption: 90 },
  { product: "Client Portal", adoption: 60 },
];

export const teamMembers = [
  { id: 1, name: "Sarah Chen", role: "Design Lead", active: true },
  { id: 2, name: "Miguel Alvarez", role: "Engineering Lead", active: true },
  { id: 3, name: "Priya Nair", role: "Product Designer", active: true },
  { id: 4, name: "Jordan Reed", role: "Frontend Engineer", active: false },
];

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

export const mockProps = [
  { name: "variant", type: "string", default: "primary", description: "Visual style of the component" },
  { name: "size", type: "'sm' | 'md' | 'lg'", default: "md", description: "Controls sizing scale" },
  { name: "disabled", type: "boolean", default: "false", description: "Disables interactions" },
  { name: "onClick", type: "() => void", default: "—", description: "Callback fired on click" },
  { name: "children", type: "ReactNode", default: "—", description: "Content rendered inside" },
  { name: "className", type: "string", default: "—", description: "Extra classes to merge" },
];

export const mockChangelog = [
  { version: "2.3.0", date: "Jun 24, 2026", description: "Added new tonal variant and refined focus ring.", breaking: false },
  { version: "2.2.1", date: "May 12, 2026", description: "Fixed hover state on macOS Safari.", breaking: false },
  { version: "2.2.0", date: "Apr 03, 2026", description: "Introduced compact size and loading state.", breaking: false },
  { version: "2.0.0", date: "Jan 15, 2026", description: "Renamed color prop to tone. Removed legacy sizes.", breaking: true },
  { version: "1.4.2", date: "Nov 08, 2025", description: "Accessibility: improved keyboard focus order.", breaking: false },
];
