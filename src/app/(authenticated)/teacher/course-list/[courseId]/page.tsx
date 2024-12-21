"use client";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import AssignmentFilter from "@/app/(authenticated)/staff/assignment/AssignmentFilter";
import AssignmentList from "./AssignmentList";
import { FaSmile } from "react-icons/fa";

export default function CourseDetail({
  params: { courseId },
}: {
  params: { courseId: string };
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [module, setModule] = useState(new Set([]));
  const [skill, setSkill] = useState(new Set([]));
  const [band, setBand] = useState(new Set([]));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const onSubmit = async (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    // const ret = await fetchAssignmentListData(page);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const data = new Array(30).fill(0).map((item, index) => ({
    id: index + 1,
    name: `Bài tập ${index + 1}`,
    module: {
      name: index % 2 === 0 ? "TOEIC" : "IELTS",
    },
    skill: {
      name: ["Listening", "Writing", "Reading", "Speaking"][index % 4],
    },
    bandScore: {
      name: index % 2 === 0 ? "8.0" : "500",
    },
  }));

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
        {isLoading ? (
          <Spinner
            className=""
            label="Đang tải..."
            color="warning"
            labelColor="warning"
          />
        ) : data.length > 0 ? (
          <AssignmentList
            data={data.slice(
              (currentPage - 1) * itemsPerPage,
              (currentPage - 1) * itemsPerPage + itemsPerPage
            )}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={Math.ceil(data.length / itemsPerPage)}
            onSubmit={onSubmit}
            route={`/teacher/course-list/${courseId}/assignment/`}
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
}
