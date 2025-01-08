/* eslint-disable no-undef */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import './styles.css';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthSvg from '@/assets/AuthSvg';
import { MobileNav } from './MobileNavBar';
import Logo from '../logo';
import { useNotification } from '@/hooks/useNotification';
import { FaBell, FaRegBell } from 'react-icons/fa';

const NavigationMenuDemo = ({ session }) => {
  const [user] = useState(session?.user);
  const [show, setShow] = useState('translate-y-0');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();

  const { onGetNotificationByUserId } = useNotification();
  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (user) {
      // Fetch notifications when the user is logged in
      fetchNotifications(user.id);
    }
  }, [user]);

  const fetchNotifications = async (userId) => {
    try {
      const notifications = await onGetNotificationByUserId(userId);
      setNotifications(notifications);
      const unread = notifications.filter((noti) => !noti.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const controlNavbar = () => {
    if (window.scrollY > 100) {
      if (window.scrollY > lastScrollY) {
        setShow('-translate-y-[82px]');
      } else {
        setShow('shadow-sm');
      }
    } else {
      setShow('translate-y-0');
    }
    setLastScrollY(window.scrollY);
  };

  const handleNavigation = async (href) => {
    if (!session) {
      window.location.href = '/auth/login';
    } else {
      window.location.href = href;
    }
  };

  const handleBellClick = () => {
    router.push('/notifications'); // Mock route for notifications
  };

  return (
    <div
      className={`w-full h-[50px] md:h-[80px] 
      bg-[#FDF8EE]  items-center justify-between z-20
    sticky transition-transform duration-300 px-14  
    ${show}
    `}
    >
      <MobileNav />
      <div className="hidden lg:flex py-5">
        <div className="flex flex-row gap-5 items-center justify-center">
          {/* Other menu items */}
        </div>
        <div className="m-2" />
        <Logo />
        <NavigationMenu.Root className="NavigationMenuRoot">
          <NavigationMenu.List className="NavigationMenuList">
            <NavigationMenu.Item>
              <NavigationMenu.Link className="NavigationMenuLink" href={'/'}>
                Trang Chủ
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href={'/introduction'}
              >
                Giới thiệu
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                onClick={() => handleNavigation('/course-list')}
              >
                Khóa học
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                onClick={() => handleNavigation('/entrance_examination')}
              >
                Thi thử
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href={'/contact'}
              >
                Liên hệ
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Indicator className="NavigationMenuIndicator">
              <div className="Arrow" />
            </NavigationMenu.Indicator>
          </NavigationMenu.List>

          <div className="ViewportPosition">
            <NavigationMenu.Viewport className="NavigationMenuViewport" />
          </div>
        </NavigationMenu.Root>

        {user ? (
          <div className="ml-8 flex gap-3 flex-row items-center justify-center">
            {/* Bell icon with unread count */}
            <Button
              onClick={handleBellClick}
              className=" relative bg-transparent hover:bg-transparent"
            >
              {<FaRegBell size={20} className="text-black" />}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center hover: bg-red-500">
                  {unreadCount}
                </span>
              )}
            </Button>
            <div className="w-20 pb-1 font-bold text-md ">{user.name}</div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Hồ sơ</Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                  className="border-solid border-t-2 mt-2 gap-2"
                >
                  <div className="">{AuthSvg.signIn()}</div>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button className="w-[150px] ml-8 h-8 text-white hover:bg-pink-700 bg-[#4D2C5E]">
            <Link href={'/auth/login'}>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationMenuDemo;
