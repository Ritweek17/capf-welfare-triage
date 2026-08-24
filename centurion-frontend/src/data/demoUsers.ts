export interface DemoAccountShortcut {
  label: string;
  loginId: string;
  password?: string;
  role:
    | "COMMANDER"
    | "WELFARE_OFFICER"
    | "PERSONNEL";
}

export const DEMO_ACCOUNTS: DemoAccountShortcut[] = [
  {
    label: "Commander",
    loginId: "CMD-X-ARJUN",
    password: "Cx@A79#21",
    role: "COMMANDER",
  },
  {
    label: "Welfare Officer",
    loginId: "WEL-X-VIKRAM",
    password: "Wx@V32#15",
    role: "WELFARE_OFFICER",
  },
  {
    label: "Personnel",
    loginId: "p_00013",
    role: "PERSONNEL",
  },
];
