import AssignmentCard from "@/components/cards/AssignmentCard";
import { Pagination } from "@nextui-org/react";
import React from "react";
import styles from "./styles.module.css";

const AssignmentList = ({
  data,
  currentPage,
  setCurrentPage,
  totalPage,
  onSubmit,
  route,
}) => {
  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <div
          className={`w-full h-fit gap-8 justify-center ${styles.assignment_auto_fit_grid}`}
        >
          {data?.map((item) => (
            <div key={item.id}>
              <AssignmentCard
                data={item}
                route={route}
                className="m-0 w-full"
              />
            </div>
          ))}
        </div>
        {data && data.length != 0 ? (
          <div className="w-full h-fit flex justify-center items-center">
            <Pagination
              color="warning"
              showControls
              total={totalPage}
              initialPage={1}
              onChange={async (page) => {
                setCurrentPage(page);
                await onSubmit(page);
              }}
              page={currentPage}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default AssignmentList;
