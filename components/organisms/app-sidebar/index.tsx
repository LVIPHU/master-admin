'use client'

import * as React from 'react'
import {
  CircleQuestionMarkIcon,
  GalleryVerticalEnd,
  SearchIcon,
  Calendar,
  Users,
  SettingsIcon,
  SquareTerminal,
  BadgeDollarSign,
} from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import NavMain from './nav-main'
import NavProjects from './nav-projects'
import NavUser from './nav-user'
import TeamSwitcher from './team-switcher'
import { NavSecondary } from '@/components/organisms/app-sidebar/nav-secondary'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'TBC Admin',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    // {
    //   name: 'TBC Admin',
    //   logo: AudioWaveform,
    //   plan: 'Startup',
    // },
    // {
    //   name: 'TBC Admin',
    //   logo: Command,
    //   plan: 'Free',
    // },
  ],
  navMain: [
    {
      title: 'Commission Package',
      url: '/admin/dashboard',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Voucher Package',
      url: '/admin/voucher',
      icon: BadgeDollarSign,
      isActive: false,
    },
    {
      title: 'Event',
      url: '/admin/event',
      icon: Calendar,
      isActive: false,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: Users,
      isActive: false,
    },
    // {
    //   title: 'Models',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: 'Genesis',
    //       url: '#',
    //     },
    //     {
    //       title: 'Explorer',
    //       url: '#',
    //     },
    //     {
    //       title: 'Quantum',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Documentation',
    //   url: '#',
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: 'Introduction',
    //       url: '#',
    //     },
    //     {
    //       title: 'Get Started',
    //       url: '#',
    //     },
    //     {
    //       title: 'Tutorials',
    //       url: '#',
    //     },
    //     {
    //       title: 'Changelog',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Settings',
    //   url: '#',
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: 'General',
    //       url: '#',
    //     },
    //     {
    //       title: 'Team',
    //       url: '#',
    //     },
    //     {
    //       title: 'Billing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Limits',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
  projects: [
    // {
    //   name: 'Design Engineering',
    //   url: '#',
    //   icon: Frame,
    // },
    // {
    //   name: 'Sales & Marketing',
    //   url: '#',
    //   icon: PieChart,
    // },
    // {
    //   name: 'Travel',
    //   url: '#',
    //   icon: Map,
    // },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: CircleQuestionMarkIcon,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
    },
  ],
}

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
        {/*<NavSecondary items={data.navSecondary} className='mt-auto' />*/}
      </SidebarContent>
      <SidebarFooter>
        {/*<NavUser user={data.user} />*/}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
