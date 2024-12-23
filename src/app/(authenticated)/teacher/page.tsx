'use client'; // Ensure this component runs on the client-side

import CourseCard from '@/components/cards/CourseCard';
import { Button, Pagination, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useCourse } from '@/hooks/useCourse';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const router = useRouter();

  const handleCourseClick = (id) => {
    router.push(`/teacher/course-list/${id}`);
  };
  // Set selected option button
  const [type, setType] = useState(1);
  // Get first n items of data
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(10);

  const buttons = [
    { id: 1, text: 'Đang diễn ra' },
    { id: 2, text: 'Đã kết thúc' },
    { id: 3, text: 'Sắp tới' },
  ];
  const { onGetCourse } = useCourse();

  const courseDataQueryKey = ['room', currentPage];

  const fetchCourseListData = async () => {
    const courseList = await onGetCourse(
      currentPage,
      itemsPerPage,
      type === 1 ? 'open' : type === 2 ? 'close' : 'soon'
    );
    return courseList;
  };

  // Fetch review data
  const {
    data: courseListData,
    refetch,
    isFetching,
  } = useQuery(courseDataQueryKey, fetchCourseListData, {
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
  });

  const handleButtonClick = async (buttonId) => {
    setType(buttonId);
    await setCurrentPage(1);
    await setType(buttonId);
    await refetch();
  };
  //Set total page when data is fetched
  useEffect(() => {
    if (courseListData) {
      setTotalPage(courseListData.totalPage);
    }
  }, [courseListData]);

  console.log(
    '🚀 ~ file: RoomList.tsx:58 ~ RoomList ~ roomListData:',
    courseListData
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

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
                    ? 'bg-orange text-white'
                    : 'bg-white text-orange'
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
        {isFetching || !courseListData ? (
          <Spinner
            className=""
            label="Đang tải..."
            color="warning"
            labelColor="warning"
          />
        ) : (
          <div className="w-full h-fit flex flex-col items-center justify-center">
            <div className="w-full h-fit grid grid-cols-3 items-center">
              {courseListData?.data.map((item) => (
                <div
                  key={item.id}
                  className="w-full h-fit flex flex-row items-center justify-between"
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
              showControls
              total={totalPage}
              initialPage={1}
              onChange={(page) => {
                onPageChange(page);
              }}
              page={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
