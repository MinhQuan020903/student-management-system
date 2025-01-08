'use client';

import { getRequest } from '@/lib/fetch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCourse = () => {
  // Fetch all courses
  const fetchAllCourses = async () => {
    const res = await axios.get(
      `/api/staff/user_management/course_management/get_all_courses`
    );
    return res.data;
  };

  const {
    data: courses,
    isLoading: isCoursesLoading,
    isFetching: isCoursesFetching,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchAllCourses(),
  });

  // Fetch paginated courses
  const fetchCourseByParams = async ({
    page,
    limit,
    type,
  }: {
    page: number;
    limit: number;
    type: string;
  }) => {
    const currentTime = new Date().toISOString();
    const res = await axios.get(
      `/api/course/all?page=${page}&limit=${limit}&currentTime=${currentTime}&type=${type}`
    );
    return res.data;
  };

  // Fetch top n courses
  const fetchTopCourses = async (top: number) => {
    const res = await getRequest({
      endPoint: `/api/course/top?top=${top}`,
    });
    return res;
  };

  // Fetch course details by slug
  const fetchCourseDetails = async (slug: string) => {
    const res = await getRequest({
      endPoint: `/api/course/course_details?courseId=${slug}`,
    });
    return res;
  };

  // Fetch course info by slug
  const fetchCourseInfo = async (slug: string) => {
    const res = await getRequest({
      endPoint: `/api/course/info?courseId=${slug}`,
    });
    return res;
  };

  // Fetch courses by userId
  const fetchCoursesByUserId = async ({
    page,
    limit,
    type,
    userId,
  }: {
    page: number;
    limit: number;
    type: string;
    userId: number;
  }) => {
    const currentTime = new Date().toISOString();
    const res = await getRequest({
      endPoint: `/api/course/all1?page=${page}&limit=${limit}&currentTime=${currentTime}&type=${type}&userId=${userId}`,
    });
    return res;
  };

  // Check if a user has ordered a specific course
  const checkCourseOrder = async ({
    courseId,
    userId,
  }: {
    courseId: string;
    userId: string;
  }) => {
    const res = await axios.post(
      `/api/staff/user_management/course_management/check_order?courseId=${courseId}&userId=${userId}`
    );
    return res;
  };

  // Fetch assignments for a course
  const fetchCourseAssignments = async (courseId: number) => {
    const res = await getRequest({
      endPoint: `/api/course/assignments?courseId=${courseId}`,
    });
    return res;
  };

  // Fetch all courses a student is enrolled in
  const fetchStudentCourses = async (userId: number) => {
    const res = await getRequest({
      endPoint: `/api/course/enrolled?userId=${userId}`,
    });
    console.log(res);
    return res;
  };

  // React Query for new methods
  const useCourseAssignments = (courseId: number) =>
    useQuery({
      queryKey: ['courseAssignments', courseId],
      queryFn: () => fetchCourseAssignments(courseId),
      enabled: !!courseId,
    });

  const useStudentCourses = (userId: number) =>
    useQuery({
      queryKey: ['studentCourses', userId],
      queryFn: () => fetchStudentCourses(userId),
      enabled: !!userId,
    });

  const useTopCourses = (top: number) =>
    useQuery({
      queryKey: ['topCourses', top],
      queryFn: () => fetchTopCourses(top),
      enabled: !!top,
    });

  const useCourseDetails = (slug: string) =>
    useQuery({
      queryKey: ['courseDetails', slug],
      queryFn: () => fetchCourseDetails(slug),
      enabled: !!slug,
    });

  const useCoursesByUserId = ({
    page,
    limit,
    type,
    userId,
  }: {
    page: number;
    limit: number;
    type: string;
    userId: number;
  }) =>
    useQuery({
      queryKey: ['coursesByUserId', userId, page, limit, type],
      queryFn: () => fetchCoursesByUserId({ page, limit, type, userId }),
      enabled: !!userId,
    });

  return {
    courses,
    isCoursesLoading,
    isCoursesFetching,
    useCourseAssignments,
    useStudentCourses,
    useTopCourses,
    useCourseDetails,
    useCoursesByUserId,
    fetchCourseAssignments,
    fetchStudentCourses,
    onCheckOrder: checkCourseOrder,
    onGetCourseInfo: fetchCourseInfo,
    onGetCourse: fetchCourseByParams,
  };
};
