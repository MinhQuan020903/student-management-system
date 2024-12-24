'use client';
import { useCourse } from '@/hooks/useCourse';
import { useEffect, useState } from 'react';
import { CourseDetails } from '@/models';
import { Spinner } from '@nextui-org/react';
import AssignmentList from '@/app/(authenticated)/staff/assignment/AssignmentList';
import { useAssignment } from '@/hooks/useAssignment';
import { FaSmile } from 'react-icons/fa';

const page = ({ params: { slug } }: { params: { slug: string } }) => {
  const { onGetCourseDetails } = useCourse();
  const [courseDetails, setCourseDetails] = useState<CourseDetails>();

  useEffect(() => {
    const getCourseDetails = async () => {
      const res = await onGetCourseDetails(slug);
      const data = await res.json();
      setCourseDetails(data);
    };

    getCourseDetails();
  }, [slug]);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log('🚀 ~ file: page.tsx:11 ~ page ~ data:', data);

  const module = [
    { id: 1, module: 'IELTS' },
    { id: 2, module: 'TOEIC' },
  ];
  const skill = [
    { id: 1, skill: 'Listening' },
    { id: 2, skill: 'Reading' },
    { id: 3, skill: 'Writing' },
    { id: 4, skill: 'Speaking' },
  ];
  const band = [
    { id: 1, moduleId: 1, band: '5.0' },
    { id: 2, moduleId: 1, band: '6.0' },
    { id: 3, moduleId: 1, band: '7.0' },
    { id: 4, moduleId: 1, band: '8.0' },
    { id: 5, moduleId: 2, band: '500' },
    { id: 6, moduleId: 2, band: '600' },
    { id: 7, moduleId: 2, band: '700' },
    { id: 8, moduleId: 2, band: '800' },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalPage, setTotalPage] = useState(1);

  const { onGetAssignmentByCourse } = useAssignment();

  const fetchAssignmentListData = async (page) => {
    const assignmentList = await onGetAssignmentByCourse(
      page,
      itemsPerPage,
      module[0].id,
      skill[0].id,
      band[0].id,
      parseInt(slug)
    );
    return assignmentList;
  };
  const onSubmit = async (page) => {
    setIsLoading(true);
    await setCurrentPage(page);
    const ret = await fetchAssignmentListData(page);
    await setTotalPage(ret.totalPage);
    await setData(ret);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAssignmentListData(currentPage);
      await onSubmit(currentPage);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col py-6 px-32 justify-center">
      <div className="w-full h-full flex flex-col gap-6">
        <div className="ml-4 font-bold text-2xl">Danh sách khóa học</div>
        {isLoading ? (
          <Spinner
            className="mt-24"
            label="Đang tải..."
            color="warning"
            labelColor="warning"
          />
        ) : data ? (
          <AssignmentList
            data={data.data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPage}
            isLoading={isLoading}
            onSubmit={onSubmit}
            route={`/entrance_examination/assignment_detail/`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <FaSmile size={30} className="text-warning mb-4" />
            <span className="text-warning text-lg text-muted">
              Không có dữ liệu!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
