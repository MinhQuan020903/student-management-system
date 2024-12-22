import React from 'react';
import { Checkbox, Image } from '@nextui-org/react';
import Link from 'next/link';
const AdminCourseCard = ({ data }) => {
  const href = '/admin/course-list/' + data.id;
  return (
    <Link
      aria-label="Products"
      href={href}
      className="w-full h-fit flex flex-row justify-between shadow-md rounded-md p-2 m-3 items-center"
    >
      <div className="w-fit h-full flex flex-row items-center">
        <Checkbox radius="sm" />
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={data.thumbnail}
          width={75}
          height={75}
        />
        <div className="w-fit h-full flex flex-col justify-center ml-3">
          <div className="font-bold">{data.name}</div>
          <div>ID:{data.id}</div>
        </div>
      </div>
    </Link>
  );
};

export default AdminCourseCard;
