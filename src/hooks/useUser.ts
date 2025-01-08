'use client';
import axios from 'axios';
import { User } from '@/models';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@/lib/fetch';
export const useUser = () => {
  // Get all user
  const fetchAllUser = async (): Promise<User[]> => {
    const res = await axios.get(`/api/staff/user_management/all`);
    return res.data;
  };
  const {
    data: users,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchAllUser(),
  });

  const onAddUser = async (value: any, password: any) => {
    const res = await axios.post(`/api/user/add`, {
      email: value?.email,
      password: password,
      fullName: value?.fullName,
      role: value.role,
      birthday: value?.birthday || null,
      phoneNumber: value?.phoneNumber,
    });
    console.log('🚀 ~ file: useUser.ts:22 ~ onAddUser ~ res:', res);

    return res;
  };
  const onGetUserDetail = async (userId) => {
    const productDetail = await getRequest({
      endPoint: `/api/user?userId=${userId}`,
    });
    // const data = await productDetail?.json();

    return productDetail;
  };

  const onUpdateUser = async (userId: any, values: any) => {
    const res = await axios.put(`/api/staff/user_management/edit`, {
      id: userId,
      fullName: values?.fullName,
      role: values?.role,
      birthDay: values?.birthday,
      phoneNumber: values?.phoneNumber,
    });
    console.log('🚀 ~ file: useUser.ts:22 ~ onUpdateUser ~ res:', res);
    return res;
  };

  const onDeleteUser = async (userId: any) => {
    const res = await axios.put(`/api/staff/user_management/delete`, {
      id: userId,
    });
    return res;
  };

  const onGetUserTranscript = async (userId: any) => {
    const res = await axios.get(`/api/user/transcript?userId=${userId}`);
    return res;
  };

  return {
    onGetUserDetail,
    onAddUser,
    onUpdateUser,
    onDeleteUser,
    onGetUserTranscript,
    users,
    isUsersLoading,
    isUsersFetching,
  };
};
