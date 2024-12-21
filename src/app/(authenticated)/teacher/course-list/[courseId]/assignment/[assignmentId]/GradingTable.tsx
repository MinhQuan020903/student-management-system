'use client';
import React, { useState } from 'react';
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
import { ImageCustom } from '@/components/ImageCustom';
import MarkingSubmitModal from './MarkingSubmitModal';

export default function GradingTable({ assignmentId }) {
  // const { assignments, isAssignmentsFetching } = useTeacher();

  // bài nộp của học viên
  const [submitId, setSubmitId] = useState<number | null>(null);

  const isAssignmentsFetching = true;
  const assignments: Assignment_User[] = new Array(30)
    .fill(0)
    .map((item, index) => ({
      id: index + 1,
      userId: 1, //only 1 user in db right now which has id = 1
      assignmentId: assignmentId, //only 1 assignment in db right now which has id = 1
      score: null,
      files:
        '[{"id":"e1c90a57-9e41-40f0-ad7f-d48225d9b8e7-70meha.png","name":"DB_diagram (1).png","url":"https://utfs.io/f/e1c90a57-9e41-40f0-ad7f-d48225d9b8e7-70meha.png"}]',
      teacherId: 2,
      createdAt: new Date(),
      courseId: 5,
      course: {
        name: 'Khoá học TOEIC 500',
      },
      user: {
        isDisabled: false,
        name: 'Nguyễn Văn A',
        avatar:
          'https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1',
      },
      assignment: {
        name: `Bài tập 1`,
      },
    }));

  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredAssignments = [...(assignments ?? [])];

    if (hasSearchFilter) {
      filteredAssignments = filteredAssignments.filter((assignments) =>
        assignments?.course?.name
          ?.toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredAssignments = filteredAssignments.filter((user) =>
        Array.from(statusFilter).includes(String(user.user.isDisabled))
      );
    }

    return filteredAssignments;
  }, [assignments, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, rowsPerPage]);

  const renderCell = React.useCallback(
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
        case 'files': {
          let fileElements: null | React.ReactElement = null;
          if (assignment?.files) {
            try {
              // Parse chuỗi JSON để chuyển thành một mảng các đối tượng
              const filesArray = JSON.parse(
                assignment?.files.replace(/\\r\\n/g, '')
              );
              fileElements = filesArray.map(
                (file: { id: string; name: string; url: string }, index) => (
                  <div
                    key={`${assignment.id}_${index}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      onClick={(e) => {
                        window.open(file.url);
                      }}
                    >
                      <ImageCustom
                        src={file?.url}
                        alt={file.name}
                        className="h-12 w-12 shrink-0 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                        {file.name}
                      </p>
                    </div>
                  </div>
                )
              );
            } catch (error) {
              console.error('Có lỗi khi parse JSON:', error);
              fileElements = <p>Lỗi khi hiển thị file</p>;
            }
          }
          return <div>{fileElements}</div>;
        }

        case 'actions':
          return (
            <div className="relative flex justify-start items-center gap-2">
              <Tooltip content="Chấm điểm học viên">
                <Button
                  isIconOnly
                  color="primary"
                  onClick={() => {
                    setSubmitId(assignment.id);
                  }}
                >
                  <EditIcon width={30} height={30} />
                </Button>
              </Tooltip>
            </div>
          );
      }
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Tìm theo tên khóa học ..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => {
              setFilterValue('');
              setPage(1);
            }}
            onValueChange={(value?: string) => {
              if (value) {
                setFilterValue(value);
                setPage(1);
              } else {
                setFilterValue('');
              }
            }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Trạng thái
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
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
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng cộng {assignments?.length} bài tập
          </span>
          <label className="flex items-center text-default-400 text-small">
            Số dòng mỗi trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, assignments?.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? `Tất cả ${filteredItems.length} đã được chọn`
            : `${selectedKeys.size} trên ${filteredItems.length} đã được chọn`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <div className="p-4">
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: 'max-h-[382px]',
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
          className="container-snap"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align="center"
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              isAssignmentsFetching ? (
                <div className="flex flex-col items-center justify-center">
                  <Spinner />
                  <p className="text-lg">
                    Dữ liệu đang được tải lên, vui lòng chờ trong giây lát
                  </p>
                </div>
              ) : (
                'Không tìm thấy dữ liệu'
              )
            }
            items={items}
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

      <MarkingSubmitModal
        open={Boolean(submitId)}
        onClose={() => setSubmitId(null)}
        submitId={submitId as number}
        initialScore={items.find((item) => item.id === submitId)?.score}
        studentName={items.find((item) => item.id === submitId)?.user.name}
        submit={items.find((item) => item.id === submitId)?.files}
      />
    </>
  );
}
