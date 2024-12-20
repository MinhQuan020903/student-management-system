'use client';
import { useCourse } from '@/hooks/useCourse';
import { useEffect, useState } from 'react';
import { CourseDetails } from '@/models';
import { Button, Spinner } from '@nextui-org/react';
import AssignmentFilter from '@/app/(authenticated)/staff/assignment/AssignmentFilter';
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
  const [isLoading, setIsLoading] = useState(false);
  console.log('🚀 ~ file: page.tsx:11 ~ page ~ data:', data);

  const [module, setModule] = useState(new Set([]));
  const [skill, setSkill] = useState(new Set([]));
  const [band, setBand] = useState(new Set([]));

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalPage, setTotalPage] = useState(1);

  const { onGetAssignmentByCourse } = useAssignment();

  const fetchAssignmentListData = async (page) => {
    const assignmentList = await onGetAssignmentByCourse(
      page,
      itemsPerPage,
      Array.from(module)[0],
      Array.from(skill)[0],
      Array.from(band)[0],
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

  return (
    <div className="w-full h-full flex flex-col py-6 px-32 justify-center">
      <div className="w-full h-full flex flex-col gap-6">
        <AssignmentFilter
          module={module}
          setModule={setModule}
          skill={skill}
          setSkill={setSkill}
          band={band}
          setBand={setBand}
          onSubmit={onSubmit}
          setCurrentPage={setCurrentPage}
        />
        {data ? (
          <AssignmentList
            data={data.data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPage}
            isLoading={isLoading}
            onSubmit={onSubmit}
            route={`/entrance_examination/assignment_detail/`}
          />
        ) : isLoading ? (
          <Spinner
            className=""
            label="Đang tải..."
            color="warning"
            labelColor="warning"
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
