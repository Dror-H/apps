interface CreateItem {
  title: string;
  subtitle: string;
  iconType: '' | 'nzIcon' | 'fontawesome';
  iconTheme: '' | 'fab' | 'far' | 'fas' | 'fal' | 'fill' | 'outline' | 'twotone';
  icon: string;
  route?: string;
  disabled?: boolean;
}
export const CreatePopoverItems: CreateItem[] = [
  {
    title: 'Campaign',
    subtitle: 'Create a new campaign',
    iconType: 'fontawesome',
    iconTheme: 'fal',
    icon: 'fa-fw fa-bullseye-arrow',
    route: '/new-campaign',
  },
  {
    title: 'Audience',
    subtitle: 'Define new targets',
    iconType: 'fontawesome',
    iconTheme: 'fal',
    icon: 'fa-fw fa-user-check',
    route: '/audiences/new',
  },
  {
    title: 'Report',
    subtitle: 'Generate performance reports',
    iconType: 'fontawesome',
    iconTheme: 'fal',
    icon: 'fa-fw fa-file-chart-line',
    route: '/create-report',
    disabled: true,
  },
  {
    title: 'Workspace',
    subtitle: 'Create a new workspace',
    iconType: 'fontawesome',
    iconTheme: 'fal',
    icon: 'fa-fw fa-briefcase',
    route: '/account-control/workspaces',
  },
  {
    title: 'Ad Template',
    subtitle: 'Design a new creative',
    iconType: 'fontawesome',
    iconTheme: 'fal',
    icon: 'fa-fw fa-sd-card',
    route: '/ad-templates/new',
  },
  {
    title: 'Ruleset',
    subtitle: 'Define optimization rules',
    iconType: 'fontawesome',
    iconTheme: 'fal',
    icon: 'fa-fw fa-ruler-combined',
    route: '/create-ruleset',
    disabled: true,
  },
  // {
  //   title: 'Trigger',
  //   subtitle: 'Set new campaign triggers',
  //   iconType: 'fontawesome',
  //   iconTheme: 'fal',
  //   icon: 'fa-fw fa-chess-clock-alt',
  //   route: '/create-trigger',
  //   disabled: true,
  // },
];
