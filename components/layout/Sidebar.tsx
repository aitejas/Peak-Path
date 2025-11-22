import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SwitchHorizontalIcon } from '../icons/Icons';
import { NavLinkItem } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
  title: string;
  titleIcon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navLinks, title, titleIcon: TitleIcon }) => {
  const { t } = useLocalization();
  const baseLinkClasses = "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200";
  const inactiveLinkClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700";
  const activeLinkClasses = "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 font-semibold";

  return (
    <>
      <aside className={`fixed md:relative z-20 md:z-auto flex flex-col w-64 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <TitleIcon className="w-8 h-8 text-primary-600"/>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</span>
        </div>
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navLinks.map(({ to, text, icon: Icon, end }) => (
              <li key={to}>
                <NavLink 
                  to={to} 
                  end={end}
                  className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                  onClick={onClose}
                >
                  <Icon className="w-6 h-6" />
                  <span>{text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-2 border-t border-slate-200 dark:border-slate-700">
             <Link 
                to="/"
                onClick={onClose}
                className={`${baseLinkClasses} ${inactiveLinkClasses} w-full`}
              >
                <SwitchHorizontalIcon className="w-6 h-6" />
                <span>{t('switchSection')}</span>
            </Link>
        </div>
      </aside>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-10 md:hidden"></div>}
    </>
  );
};