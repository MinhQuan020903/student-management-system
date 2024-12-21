"use client"; // Ensure this component runs on the client-side

import CourseCard from "@/components/cards/CourseCard";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";

export default function Page() {
  // Initialize the router directly here since useRouter is safe in client-side rendering
  const router = useRouter();

  // Handle course click and navigate to the course page
  const handleCourseClick = (id) => {
    router.push(`/teacher/course-list/${id}`);
  };
  // Set selected option button
  const [type, setType] = useState(1);
  // Get first n items of data
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 8;

  const buttons = [
    { id: 1, text: "Đang diễn ra" },
    { id: 2, text: "Đã kết thúc" },
    { id: 3, text: "Sắp tới" },
  ];

  // Handle button click to change course list type
  const handleButtonClick = async (buttonId) => {
    setType(buttonId);
    setIsFetching(true);
    setCurrentPage(1); // Reset to page 1
    setTimeout(() => {
      setIsFetching(false);
    }, 1500);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const courseListData = new Array(20).fill(0).map((_item, index) => ({
    id: index,
    thumbnail:
      "https://utfs.io/f/b8edd4e0-f243-451c-bb80-c4434cc580a7-63b65u.png",
    name: `Khoá học TOEIC ${index + 1}`,
    totalSession: 5,
    startTime: "2024-10-04 01:39:34",
  }));

  return (
    <div className="w-full h-full">
      <div className="w-full h-fit flex flex-col px-16 pt-2">
        <div className="ml-4 font-bold text-2xl">Danh sách khóa học</div>
        <div className="w-full h-fit flex flex-row items-center justify-between">
          <div className="w-fit h-fit flex flex-row">
            {buttons.map((button) => (
              <Button
                key={button.id}
                className={`${
                  type === button.id
                    ? "bg-orange text-white"
                    : "bg-white text-orange"
                } border-orange w-32 m-4`}
                variant="bordered"
                radius="sm"
                onClick={() => handleButtonClick(button.id)}
              >
                {button.text}
              </Button>
            ))}
          </div>
          <div className="relative w-fit h-fit mr-4">
            <Button className="bg-[#FDF8EE] text-black w-32 m-4" radius="sm">
              Chọn
            </Button>
            <Button
              isIconOnly
              color="warning"
              variant="light"
              size="lg"
              className="text-black"
              aria-label="Take a photo"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col items-center">
        {courseListData ? (
          <>
            {isFetching ? (
              <Spinner
                className=""
                label="Đang tải..."
                color="warning"
                labelColor="warning"
              />
            ) : (
              <div className="w-full h-fit flex flex-col items-center justify-center">
                <div
                  className={`w-full h-fit grid grid-cols-4 gap-8 px-20 justify-center ${styles.course_auto_fit_grid}`}
                >
                  {courseListData
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      (currentPage - 1) * itemsPerPage + itemsPerPage
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="h-fit flex flex-row items-center justify-between min-w-[300px]"
                      >
                        <CourseCard
                          data={item}
                          onClick={() => {
                            handleCourseClick(item.id);
                          }}
                        />
                      </div>
                    ))}
                </div>
                <Pagination
                  color="warning"
                  className="my-5"
                  showControls
                  total={Math.ceil(courseListData.length / itemsPerPage)}
                  initialPage={1}
                  onChange={(page) => {
                    onPageChange(page);
                  }}
                  page={currentPage}
                />
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
