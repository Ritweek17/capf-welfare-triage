export interface DemoAccount {
  label: string;
  subtitle: string;
  serviceId: string;
  password?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Commander",
    subtitle: "1st Company Command",
    serviceId: "CRPF-CMD-1ST",
    password: "demo-commander-1st-2026",
  },
  {
    label: "Welfare Officer",
    subtitle: "1st Company Welfare",
    serviceId: "CRPF-WEL-1ST",
    password: "demo-welfare-1st-2026",
  },
  {
    label: "Personal",
    subtitle: "Private Profile · p_00013",
    serviceId: "CRPF-PER-00013",
    password: "demo-p-00013-2026",
  },
];
