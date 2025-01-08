'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Image,
  CircularProgress,
} from '@nextui-org/react';
import { getSession } from 'next-auth/react';
import { useCourse } from '@/hooks/useCourse';

const GradingPage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { fetchCourseAssignments, fetchStudentCourses } = useCourse();

  // Fetch user session and set userId
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.id) {
          await setUserId(session.user.id);

          // Fetch courses for the student
          const res = await fetchStudentCourses(session.user.id);
          setCourses(res);

          // Fetch assignments for each course
          const coursesWithAssignments = await Promise.all(
            res!.map(async (course) => {
              const assignmentsRes = await fetchCourseAssignments(course.id);

              // Calculate the number of assignments completed (score >= 5.0)
              const completedAssignments = assignmentsRes.filter((assignment) =>
                assignment.Assignment_Users.some(
                  (userAssignment) =>
                    userAssignment.userId === session.user.id &&
                    (userAssignment.score || 0) >= 5.0
                )
              );

              // Calculate the average score for this course
              const avgScore =
                assignmentsRes.length > 0
                  ? assignmentsRes.reduce((acc, assignment) => {
                      const score = assignment.Assignment_Users.find(
                        (userAssignment) =>
                          userAssignment.userId === session.user.id
                      )?.score;
                      return acc + (score || 0);
                    }, 0) / assignmentsRes.length
                  : 0;

              return {
                ...course,
                assignments: assignmentsRes,
                completedAssignmentsCount: completedAssignments.length,
                totalAssignmentsCount: assignmentsRes.length,
                avgScore: isNaN(avgScore) ? 0 : avgScore,
              };
            })
          );

          setCourses(coursesWithAssignments);
          setIsLoading(false);
        } else {
          console.error('User ID not found in session.');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSession();
  }, []);

  // Toggle course expansion
  const handleExpand = (courseId: number) => {
    if (expandedCourseId === courseId) {
      setIsLoading(true);
      setExpandedCourseId(null);
      setIsLoading(false);
    } else {
      setExpandedCourseId(courseId);
    }
  };

  return (
    <div className="px-16 py-8 flex flex-col items-center gap-3">
      <div className="w-[75%] text-2xl font-bold mb-5 text-orange rounded-lg shadow-lg text-center border-2 border-orange p-2">
        BẢNG ĐIỂM HỌC SINH
      </div>
      <div className="w-[75%]">
        {courses.length > 0 ? (
          courses.map((course) => {
            const completionPercentage =
              course.totalAssignmentsCount > 0
                ? (course.completedAssignmentsCount /
                    course.totalAssignmentsCount) *
                  100
                : 0;

            return (
              <div key={course.id} className="w-full mb-6">
                <div className="w-full flex flex-col gap-3 rounded-md shadow-lg p-4 bg-white">
                  <div className="w-full flex flex-row rounded-md shadow-lg p-4 justify-around">
                    <div className="w-full flex flex-row gap-5  p-4 bg-white items-center">
                      <Image
                        src={course.thumbnail}
                        alt="course thumbnail"
                        width={150}
                        height={200}
                      />
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-lg">{course.name}</span>
                        <div className="flex flex-col gap-2 justify-center text-sm text-gray-500">
                          <span>
                            Ngày bắt đầu:{' '}
                            {new Date(course.startTime).toLocaleString()}
                          </span>
                          <span>
                            Ngày kết thúc:{' '}
                            {new Date(course.endTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Completion progress circle */}
                    <div className="w-full h-fit flex flex-col xl:flex-row gap-8 justify-end items-center">
                      <CircularProgress
                        classNames={{
                          svg: 'w-36 h-36 drop-shadow-md',
                          indicator: 'stroke-yellow-orange',
                          track: 'stroke-gray-300',
                          value: 'text-3xl font-semibold text-black',
                        }}
                        value={Math.round(completionPercentage)}
                        color="warning"
                        showValueLabel={true}
                      />
                    </div>
                  </div>

                  <Button
                    fullWidth
                    onClick={() => handleExpand(course.id)}
                    disabled={isLoading && expandedCourseId === course.id}
                  >
                    <span className="font-semibold">
                      {expandedCourseId === course.id
                        ? 'Thu gọn bài tập'
                        : 'Chi tiết bài tập'}
                    </span>
                  </Button>
                </div>
                {expandedCourseId === course.id && (
                  <div className="card-footer mt-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Spinner />
                        <p>Loading assignments...</p>
                      </div>
                    ) : course.assignments?.length > 0 ? (
                      <Table aria-label="Assignments">
                        <TableHeader>
                          <TableColumn>ID</TableColumn>
                          <TableColumn>Tên bài tập</TableColumn>
                          <TableColumn>Điểm số</TableColumn>
                          <TableColumn>Nhận xét</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {course.assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell>{assignment.id}</TableCell>
                              <TableCell>{assignment.name}</TableCell>
                              <TableCell>
                                {assignment.Assignment_Users.find(
                                  (userAssignment) =>
                                    userAssignment.userId === userId
                                )?.score ?? '_'}
                              </TableCell>
                              <TableCell>
                                {assignment.Assignment_Users.find(
                                  (userAssignment) =>
                                    userAssignment.userId === userId
                                )?.comment ?? '_'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p>No assignments available for this course.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div>No courses available</div>
        )}
      </div>
    </div>
  );
};

export default GradingPage;
