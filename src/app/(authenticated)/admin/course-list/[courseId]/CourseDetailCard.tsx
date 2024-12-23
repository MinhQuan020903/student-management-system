'use client';
import { HiUserGroup } from 'react-icons/hi';
import { AiOutlineClockCircle, AiOutlineCalendar } from 'react-icons/ai';
import { Button } from '@nextui-org/react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CourseDetailCard = ({ data, onClick }) => {
  return (
    <div className="w-full h-auto rounded-xl p-4 bg-white max-w-full min-h-0 m-8 mx-auto drop-shadow-xl overflow-visible flex flex-row gap-6 break-words text-lg">
      {/* Image Container */}
      <Link href={`/course-list/${data.id}`}>
        <div
          className="relative rounded-xl bg-neutral-400"
          style={{ width: '300px', height: '200px' }}
        >
          <Image
            className="object-cover rounded-xl"
            src={data?.thumbnail}
            alt={data?.name || 'Course thumbnail'}
            layout="fill"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Description */}
      <div className="flex flex-col flex-1">
        <div className="mb-4">
          <h2 className="text-black text-xl font-bold">{data?.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <HiUserGroup className="text-orange" />
            <span className="text-orange font-medium ">
              {data?.totalAttendance} học viên
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-black text-xl font-bold">Giáo viên: </h2>
          <div className="flex items-center space-x-2 mt-2">
            <Image
              className="object-cover rounded-full"
              src={data?.teacher.avatar}
              alt={data?.teacher.name || 'Teacher avatar'}
              width={40}
              height={40}
              loading="lazy"
            />
            <span className="text-orange font-medium ">
              {data?.teacher.name}
            </span>

            <span className="text-silver-chalice font-light">
              ({data?.teacher.email})
            </span>

            <span className="text-silver-chalice font-light">
              ({data?.teacher.phoneNumber})
            </span>
          </div>
        </div>

        <hr className="border-t border-gray-400 border-dashed mb-4" />

        <div className="grid grid-cols-2 gap-4">
          {/* Total Sessions */}
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle />
            <span className="text-silver-chalice  font-light">
              {data?.totalSession} buổi
            </span>
          </div>

          {/* Course Dates */}
          <div className="flex flex-row gap-3 justify-end">
            {' '}
            <div className="flex items-center space-x-2">
              <AiOutlineCalendar />
              <span className="text-silver-chalice  font-light">
                Ngày bắt đầu:{' '}
                {new Date(data?.startTime).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineCalendar />
              <span className="text-silver-chalice  font-light">
                Ngày kết thúc:{' '}
                {new Date(data?.endTime).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Tuition Fee */}
          <div className="flex items-center justify-between">
            <span className="text-black  font-medium">Học phí:</span>
            <span className="text-orange font-medium">
              {data?.tuitionFee.toLocaleString('vi-VN')} VND
            </span>
          </div>

          {/* Total Cost */}
          <div className="flex items-center justify-between">
            <span className="text-black  font-medium">Tổng chi phí:</span>
            <span className="text-orange font-medium">
              {data?.totalCost.toLocaleString('vi-VN')} VND
            </span>
          </div>

          {/* Recommended Course */}
          {data?.recommendCourseId && (
            <div className="col-span-2 flex items-center justify-between">
              <span className="text-black  font-medium">Khóa học đề xuất:</span>
              <span className="text-orange font-medium">
                {data.recommendCourseId}
              </span>
            </div>
          )}
        </div>

        <hr className="border-t border-gray-400 border-dashed mb-4" />

        {/* Button */}
        <div className="flex justify-end mt-4">
          <Button
            className="bg-orange min-w-[10%] rounded-full"
            onClick={onClick}
          >
            <span className="text-white text-lg font-medium">Chi tiết</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailCard;
