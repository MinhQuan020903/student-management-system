'use client';

import React, { useEffect, useState } from 'react';
import CourseCard from '@/components/cards/CourseCard';
import Loader from '@/components/Loader';
import { useCourse } from '@/hooks/useCourse';
import { useParams } from 'next/navigation';
import CourseDetailCard from './CourseDetailCard';
import { Button } from '@nextui-org/react';
import { FaHouseChimney } from 'react-icons/fa6';

const Page = () => {
  const params = useParams();
  const courseId = params.courseId;
  console.log('🚀 ~ Page ~ courseId:', courseId);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { onGetCourseInfo } = useCourse();

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await onGetCourseInfo(courseId);
      if (res && res?.id) {
        setCourse(res);
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col py-2 px-20">
      <div className="w-full h-full flex flex-col">
        <div className="w-fit h-fit flex flex-col">
          <Button
            className="font-bold text-orange "
            variant="light"
            radius="sm"
            startContent={<FaHouseChimney />}
          >
            Khóa học
          </Button>
        </div>

        {course ? (
          <CourseDetailCard data={course} onClick={() => {}} />
        ) : (
          <p>Course not found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
