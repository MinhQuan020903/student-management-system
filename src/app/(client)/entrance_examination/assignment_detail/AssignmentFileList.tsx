import FileCard from '@/components/FileCard';
import React from 'react';

const AssignmentFileList = ({ assignmentFileList }) => {
  return (
    <div className="w-full h-fit flex flex-col  justify-center gap-4 font-bold">
      <span className="ml-4">Bài tập</span>
      <div className="w-full h-fit flex flex-row items-center border-2 border-orange rounded-md py-4 px-8 mx-3">
        {assignmentFileList?.length
          ? assignmentFileList?.map((file, i) => (
              <FileCard
                key={i}
                i={i}
                files={assignmentFileList}
                setFiles={assignmentFileList}
                file={file}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default AssignmentFileList;
