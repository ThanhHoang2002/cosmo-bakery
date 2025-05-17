import { 
  LayoutDashboard, 
  ShoppingBasket, 
  Users,
  X,
  List,
  ShoppingBag,
  LucideIcon
} from 'lucide-react';
import { useEffect, useRef, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { logoBg } from '@/assets/images';
import Image from '@/components/ui/image';
import { ROLES } from '@/constant/role';
import useAuthStore from '@/features/auth/stores/authStore';

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

type NavItemProps = {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isActiveCondition: boolean;
};

type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  matchExact?: boolean;
  adminOnly?: boolean;
};

const NavItem = ({ to, icon: Icon, label, isActive, isActiveCondition }: NavItemProps) => {
  return (
    <li className={`mb-0.5 rounded-sm px-3 py-2 ${isActiveCondition ? 'bg-primary/10' : ''}`}>
      <NavLink
        to={to}
        className={`block truncate text-sm font-medium ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={`Navigate to ${label}`}
        tabIndex={0}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5" />
          <span className="ml-3">{label}</span>
        </div>
      </NavLink>
    </li>
  );
};

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { currentUser } = useAuthStore();

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  // Check if user is admin
  const isAdmin = useMemo(() => {
    return currentUser?.role?.name?.toUpperCase() === ROLES.ADMIN;
  }, [currentUser]);

  // Admin navigation items
  const adminNavItems: NavItem[] = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Trang chủ', matchExact: true, adminOnly: true },
    { to: '/admin/products', icon: ShoppingBag, label: 'Sản phẩm' },
    { to: '/admin/orders', icon: ShoppingBasket, label: 'Đơn hàng' },
    { to: '/admin/customers', icon: Users, label: 'Người dùng', adminOnly: true },
    { to: '/admin/categories', icon: List, label: 'Danh mục' },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = useMemo(() => {
    return adminNavItems.filter(item => isAdmin || !item.adminOnly);
  }, [adminNavItems, isAdmin]);

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) return;
      
      setSidebarOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return;
      setSidebarOpen(false);
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [sidebarOpen, setSidebarOpen]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if a path is active
  const isPathActive = (path: string, exact = false) => {
    return exact ? pathname === path : pathname.includes(path);
  };

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900 bg-opacity-30 transition-opacity duration-200 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`no-scrollbar absolute left-0 top-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-y-scroll bg-card duration-200 ease-in-out lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between pl-6 pr-3 md:h-20">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex  w-full items-center justify-center" 
            aria-label="Go to homepage"
            tabIndex={0}
          >
            <div className="flex items-center">
              <Image src={logoBg} alt="logo" containerClassName='w-20 h-20' />
            </div>
          </NavLink>
          {/* Close button (mobile only) */}
          <button
            ref={trigger}
            className="text-muted-foreground hover:text-foreground lg:hidden"
            onClick={handleToggleSidebar}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            aria-label="Close sidebar"
            tabIndex={0}
          >
            <span className="sr-only">Đóng</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">
              <span className="hidden w-6 text-center lg:block" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden">Trang</span>
            </h3>
            <ul className="mt-3" role="menu">
              {filteredNavItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={isPathActive(item.to, item.matchExact)}
                  isActiveCondition={isPathActive(item.to, item.matchExact)}
                />
              ))}
            </ul>
          </div>
          
          {/* Store link */}
          <div>
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">
              <span className="hidden w-6 text-center lg:block" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden">Cửa hàng</span>
            </h3>
            <ul className="mt-3" role="menu">
              <NavItem
                to="/"
                icon={ShoppingBasket}
                label="Xem cửa hàng"
                isActive={false}
                isActiveCondition={false}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar; 