export interface DemoAccount {
  label: string;
  subtitle: string;
  serviceId: string;
  password?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Commander",
    subtitle: "Command Access",
    serviceId: "CRPF-DEMO-COMMANDER",
    password: "demo-commander-2026",
  },
  {
    label: "Welfare Officer",
    subtitle: "Welfare Access",
    serviceId: "CRPF-DEMO-WELFARE",
    password: "demo-welfare-2026",
  },
  {
    label: "Personnel",
    subtitle: "Demo Profile · p_00013",
    serviceId: "p_00013",
  },
];
