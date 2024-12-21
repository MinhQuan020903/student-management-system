'use client';
import AdminCourseCard from '@/components/cards/AdminCourseCard';
import { useCourse } from '@/hooks/useCourse';
import { Button, Pagination, Spinner } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function CourseList() {
  const handleCreateCourse = () => {
    window.location.href = '/admin/add-courses';
  };
  //Set selected option button
  const [type, setType] = useState(1);
  //Get first n items of data
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(10);

  const buttons = [
    { id: 1, text: 'Đang diễn ra' },

    { id: 2, text: 'Đã kết thúc' },
    { id: 3, text: 'Sắp tới' },
  ];

  const { onGetCourse } = useCourse();
  //Get review data per page from API
  // Define a query key and fetch function for fetching review data
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

  //Handle event when option button is clicked
  //(Change type of room list)

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
            <Button
              onClick={handleCreateCourse}
              className="bg-orange text-white"
            >
              <FaPlus className="mr-2" />
              Thêm khóa học
            </Button>
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
            {' '}
            {isFetching ? (
              <Spinner
                className=""
                label="Đang tải..."
                color="warning"
                labelColor="warning"
              />
            ) : (
              <div className="w-full h-fit flex flex-col items-center">
                {courseListData?.data.map((item) => (
                  <div
                    key={item.id}
                    className="w-full h-32 flex flex-row items-center justify-between px-16"
                  >
                    <AdminCourseCard data={item} />
                  </div>
                ))}
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
          </>
        ) : null}
      </div>
    </div>
  );
}
