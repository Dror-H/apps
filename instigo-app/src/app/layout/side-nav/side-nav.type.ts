export interface SideNavInterface {
  path: string;
  title: string;
  iconType: '' | 'nzIcon' | 'fontawesome';
  iconTheme: '' | 'fab' | 'far' | 'fas' | 'fill' | 'outline' | 'twotone';
  callback?: string;
  icon: string;
  submenu: SideNavInterface[];
  type?: string;
  disable?: boolean;
  comingSoon?: boolean;
  createPath?: string;
}
