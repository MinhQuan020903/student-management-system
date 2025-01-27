/* eslint-disable no-undef */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthSvg from "@/assets/AuthSvg";
import Logo from "../logo";

import {
  FaBars,
  FaBook,
  FaCalendarDays,
  FaCartShopping,
  FaDoorClosed,
} from "react-icons/fa6";
import { Button } from "../ui/button";
const AdminHeader = ({ session }) => {
  const [user] = useState(session?.user);
  console.log("usersss: ", user);
  const [show, setShow] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  });
  const controlNavbar = () => {
    if (window.scrollY > 100) {
      if (window.scrollY > lastScrollY) {
        setShow("-translate-y-[82px]");
      } else {
        setShow("shadow-sm");
      }
    } else {
      setShow("translate-y-0");
    }
    setLastScrollY(window.scrollY);
  };
  return (
    <div
      className={`w-full h-[50px] md:h-[80px] 
      bg-[#FDF8EE]  items-center md:justify-between justify-center z-30
    sticky transition-transform duration-300 px-14  
    ${show}
    `}
    >
      <div className="h-full flex justify-between items-center">
        {" "}
        <div className="flex flex-row items-center justify-center gap-16">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {/* <Button className="bg-transparent text-black hover:bg-transparent"> */}
              <FaBars className="w-8 h-8"></FaBars>
              {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#FDF8EE] ml-16 p-4 shadow-none font-bold text-lg">
              <DropdownMenuItem>
                <Link href={"/admin/course-list"}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <FaBook />
                    <div className="ml-2">Danh sách khoá học</div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href={"/admin/teacher_management"}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <Image
                      src={"/teacher.png"}
                      alt="teacher"
                      width={15}
                      height={15}
                    />
                    <div className="ml-2">Danh sách giảng viên</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/admin/student_management"}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <Image
                      src={"/teacher.png"}
                      alt="teacher"
                      width={15}
                      height={15}
                    />
                    <div className="ml-2">Danh sách học viên</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/admin/room-list"}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <FaDoorClosed />
                    <div className="ml-2">Danh sách phòng học</div>
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* <DropdownMenuItem>
                <Link href={"/admin"}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <FaCartShopping />
                    <div className="ml-2">Danh sách đăng ký</div>
                  </div>
                </Link>
              </DropdownMenuItem> */}

              {/* <DropdownMenuItem>
                <Link href={"/admin/tkb"}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <FaCalendarDays />
                    <div className="ml-2">Thời khóa biểu</div>
                  </div>
                </Link>
              </DropdownMenuItem> */}

              {/* <DropdownMenuItem>
                <Link href={'/admin/chat'}>
                  <div className="flex flex-row hover:text-orange justify-center items-center">
                    <FaCommentDots />
                    <div className="ml-2">Hỏi đáp</div>
                  </div>
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <Logo />
        </div>
        {user ? (
          <div className="flex flex-row gap-5 items-center justify-center">
            <div className="font-bold text-md">{user.name}</div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                {" "}
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
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="border-solid border-t-2 mt-2  gap-2"
                >
                  <div className="">{AuthSvg.signIn()}</div>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button className="w-[150px] ml-8 h-4 text-white hover:bg-pink-700 bg-[#4D2C5E]">
            <Link href={"/auth/login"}>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
