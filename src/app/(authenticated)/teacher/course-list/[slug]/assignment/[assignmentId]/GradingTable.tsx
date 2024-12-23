'use client';
import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  User as UserInfo,
  Spinner,
  Tooltip,
} from '@nextui-org/react';
import { FaEdit as EditIcon } from 'react-icons/fa';
import { ChevronDownIcon } from './ChevronDownIcon';
import { SearchIcon } from './SearchIcon';
import { columns, statusOptions } from './data';
import { capitalize } from './utils';
import { Assignment_User } from '@/models';
import MarkingSubmitModal from './MarkingSubmitModal';
import { useQuery } from '@tanstack/react-query';
import { useAssignment } from '@/hooks/useAssignment';

export default function GradingTable({
  assignmentId,
}: {
  assignmentId: number;
}) {
  const { onGetAssignmentFromUsersByAssignmentId } = useAssignment();

  // State management
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });
  const [submitId, setSubmitId] = useState<number | null>(null);

  // Query key for caching
  const queryKey = useMemo(
    () => [
      'assignments',
      {
        assignmentId,
        page,
        rowsPerPage,
        filterValue,
        statusFilter,
        sortDescriptor,
      },
    ],
    [assignmentId, page, rowsPerPage, filterValue, statusFilter, sortDescriptor]
  );

  // Fetch function
  const fetchAssignments = async () => {
    const response = await onGetAssignmentFromUsersByAssignmentId(
      page,
      rowsPerPage,
      filterValue,
      assignmentId
    );
    return response;
  };

  // React Query to fetch assignments
  const {
    data: assignmentData,
    isFetching,
    isLoading,
  } = useQuery(queryKey, fetchAssignments, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const assignments = assignmentData?.data || [];
  const totalAssignments = assignmentData?.total || 0;
  const totalPages = Math.ceil(totalAssignments / rowsPerPage);

  const onSubmitResultCallback = async () => {
    await setSubmitId(null);
    window.location.reload();
  };

  // Render cell content
  const renderCell = useCallback(
    (assignment: Assignment_User, columnKey: React.Key) => {
      const cellValue = assignment[columnKey as keyof Assignment_User];
      switch (columnKey) {
        case 'id':
          return <p>{cellValue as number}</p>;
        case 'course':
          return <p>{assignment.course?.name}</p>;
        case 'exercise':
          return <p>{assignment.assignment?.name}</p>;
        case 'score':
          return <p>{cellValue ? `${cellValue} điểm` : 'Chưa chấm'}</p>;
        case 'student':
          return (
            <UserInfo
              avatarProps={{ radius: 'lg', src: assignment.user.avatar }}
              description="Học viên"
              name={assignment.user.name}
            ></UserInfo>
          );
        case 'files':
          try {
            const filesArray = JSON.parse(assignment?.files || '[]');
            return filesArray.map(
              (file: { id: string; name: string; url: string }, index) => (
                <div
                  key={`${assignment.id}_${index}`}
                  className="flex items-center gap-2"
                >
                  <div
                    onClick={() => window.open(file.url)}
                    className="cursor-pointer"
                  >
                    <img
                      src={file?.url}
                      alt={file.name}
                      className="h-12 w-12 shrink-0 rounded-md"
                    />
                  </div>
                  <p className="line-clamp-1 text-sm font-medium">
                    {file.name}
                  </p>
                </div>
              )
            );
          } catch (error) {
            return <p>Lỗi khi hiển thị file</p>;
          }
        case 'actions':
          return (
            <Tooltip content="Chấm điểm học viên">
              <Button
                isIconOnly
                color="primary"
                onClick={() => setSubmitId(assignment.id)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          );
      }
    },
    []
  );

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          placeholder="Tìm theo tên khóa học ..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => setFilterValue('')}
          onValueChange={(value) => setFilterValue(value || '')}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
            >
              Trạng thái
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectionMode="multiple"
            selectedKeys={statusFilter}
            onSelectionChange={setStatusFilter}
          >
            {statusOptions.map((status) => (
              <DropdownItem key={status.uid} className="capitalize">
                {capitalize(status.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-small">Tổng cộng {totalAssignments} bài tập</span>
        <label className="flex items-center text-small">
          Số dòng mỗi trang:
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        isCompact
        color="primary"
        page={page}
        total={totalPages}
        onChange={setPage}
      />
    </div>
  );

  return (
    <>
      <div className="p-4">
        <Table
          aria-label="Grading table with pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={assignments}
            emptyContent={
              isLoading ? (
                <div className="flex flex-col items-center">
                  <Spinner />
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : (
                'Không có dữ liệu'
              )
            }
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {submitId && (
        <MarkingSubmitModal
          open
          onClose={() => setSubmitId(null)}
          submitId={submitId}
          initialScore={assignments.find((a) => a.id === submitId)?.score}
          studentName={assignments.find((a) => a.id === submitId)?.user.name}
          submit={assignments.find((a) => a.id === submitId)?.files}
          onSubmitCallback={onSubmitResultCallback}
        />
      )}
    </>
  );
}
