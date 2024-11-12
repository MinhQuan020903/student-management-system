'use client';
import { Controller, useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import React from 'react';
import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa';
import { FaRegUser as UserIcon } from 'react-icons/fa';
import { FaChalkboardTeacher as RoleIcon } from 'react-icons/fa';
import { IoIosMail as MailIcon } from 'react-icons/io';
import { format, parseISO, isValid } from 'date-fns';
import { FaSquarePhoneFlip as PhoneIcon } from 'react-icons/fa6';
import validator from 'validator';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { vi } from 'date-fns/locale';

const roles = [
  { label: 'Giảng viên', value: 'teacher' },
  { label: 'Học viên', value: 'user' },
];

//quan ly form: react-hook-form
const formSchema = z.object({
  fullName: z
    .string()
    .nonempty({ message: 'Họ tên không được để trống' })
    .refine((value) => !/\d/.test(value), 'Họ tên không được chứa số')
    .refine(
      (value) =>
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/i.test(
          value
        ),
      'Họ tên không được chứa kí tự đặc biệt'
    ),
  birthday: z
    .date()
    .optional()
    .refine(
      (value) => !value || value <= new Date(),
      'Ngày sinh không thể là tương lai'
    ),
  role: z.string().nonempty({ message: 'Vai trò không được để trống' }),
  email: z
    .string()
    .nonempty({ message: 'Email không được để trống' })
    .email({ message: 'Email không hợp lệ' }),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[0-9]+$/.test(value),
      'Số điện thoại chỉ được chứa số'
    )
    .refine(
      (value) => !value || validator.isMobilePhone(value, 'vi-VN'),
      'Số điện thoại không hợp lệ'
    ),
});

//validate form: zod
const EditUserDialog = ({
  isOpen,
  onOpenChange,
  onClose,
  selectedUser,
  modalStatus,
}) => {
  /* Hooks */
  const { onUpdateUser, users } = useUser();
  const queryClient = useQueryClient();
  /* Start Form state */
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async () => {
    try {
      handleClose();
      await onUpdateUser(selectedUser.id, values);

      reset();
      queryClient.invalidateQueries(['users']);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  });

  /* End Form state */
  const birthday = watch('birthday');
  const values = getValues();

  React.useEffect(() => {
    console.log(
      '🚀 ~ file: EditUserDialog.tsx:47 ~ EditUserDialog ~ values:',
      values
    );
    console.log(users);
  }, [values]);

  React.useEffect(() => {
    const resetForm = async () => {
      if (isOpen && selectedUser) {
        const parsedDate = parseISO(selectedUser.birthDay);
        if (!isValid(parsedDate)) {
          console.error('Ngày sinh không hợp lệ:', parsedDate);
        }

        await reset({
          fullName: selectedUser.name,
          role: selectedUser.role,
          birthday: isValid(parsedDate) ? parsedDate : null,
          phoneNumber: selectedUser.phoneNumber,
          email: selectedUser.email,
        });
      }
    };

    resetForm();
  }, [selectedUser, isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      scrollBehavior="outside"
      size="2xl"
      backdrop="blur"
      isDismissable={false}
      hideCloseButton={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center">
              {modalStatus === 'view' ? (
                <div className="mt-2">Xem thông tin người dùng</div>
              ) : (
                <div className="mt-2">Chỉnh sửa thông tin người dùng</div>
              )}
            </ModalHeader>
            <ModalBody>
              {/* Name */}
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    endContent={
                      <UserIcon className="text-2xl text-black font-semibold pointer-events-none flex-shrink-0" />
                    }
                    label={
                      <span className="text-base text-black font-semibold">
                        Họ và tên{' '}
                        <span className="text-red-500 font-semibold">(*)</span>
                      </span>
                    }
                    placeholder="Nhập họ tên người dùng"
                    variant="bordered"
                    classNames={{
                      inputWrapper: 'bg-old-lace',
                    }}
                    onChange={(e) => {
                      setValue('fullName', e.target.value);
                      trigger('fullName');
                    }}
                    isDisabled={modalStatus === 'view'}
                  />
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm italic ml-2">
                  {errors.fullName.message}
                </p>
              )}

              {/* Birthday & Role*/}
              <div className="flex flex-row items-center justify-between">
                {/* Birthday */}
                <div>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        className={`w-[240px] h-[56px] justify-start text-left font-normal ${
                          !birthday ? 'text-muted-foreground' : ''
                        }`}
                        isDisabled={modalStatus === 'view'}
                      >
                        <div className={`flex flex-col justify-center h-full`}>
                          <span className="text-sm text-black font-semibold">
                            Ngày sinh
                          </span>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthday ? (
                              format(birthday, 'PPP', { locale: vi })
                            ) : (
                              <span className="text-slate-500">
                                Chọn ngày tháng năm sinh
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="w-auto">
                        <Controller
                          control={control}
                          name="birthday"
                          render={({ field: { onChange, value } }) => (
                            <Calendar
                              locale={vi}
                              mode="single"
                              selected={value}
                              onSelect={(date) => {
                                onChange(date); // Cập nhật giá trị của trường 'birthday' khi người dùng chọn một ngày
                                // Không cần gọi trigger nếu bạn đang sử dụng Controller, vì nó sẽ tự động validate
                              }}
                            />
                          )}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Role */}
                <div>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        label={
                          <span className="text-base text-black font-semibold">
                            Vai trò{' '}
                            <span className="text-red-500 font-semibold">
                              (*)
                            </span>
                          </span>
                        }
                        placeholder="Lựa chọn vai trò"
                        labelPlacement="inside"
                        radius="sm"
                        className="w-[240px] font-bold"
                        classNames={{
                          trigger: 'bg-old-lace',
                          value: 'font-normal text-slate-500',
                          label: 'text-slate-500 font-normal',
                        }}
                        startContent={
                          <RoleIcon className="text-xl text-black pointer-events-none flex-shrink-0" />
                        }
                        isDisabled={modalStatus === 'view'}
                        selectedKeys={[value]}
                        onChange={(value) => {
                          onChange(value);
                          trigger('role');
                        }}
                      >
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Error message */}
              <div className="flex flex-row justify-between">
                <div className="w-[240px]">
                  {errors.birthday && (
                    <p className="text-red-500 text-sm italic mt-2 ml-2">
                      {errors.birthday.message}
                    </p>
                  )}
                </div>
                <div className="w-[240px]">
                  {errors.role && (
                    <p className="text-red-500 text-sm italic mt-2 mr-50">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    endContent={
                      <MailIcon className="text-3xl text-black font-bold pointer-events-none flex-shrink-0" />
                    }
                    label={
                      <span className="text-base text-black font-semibold">
                        Email{' '}
                        <span className="text-red-500 font-semibold">(*)</span>
                      </span>
                    }
                    placeholder="Nhập email đăng ký"
                    type="email"
                    variant="bordered"
                    classNames={{
                      inputWrapper: 'bg-old-lace',
                    }}
                    {...register('email')}
                    onChange={(e) => {
                      setValue('email', e.target.value);
                      trigger('email');
                    }}
                    isDisabled
                  />
                )}
              />

              {errors.email && (
                <p className="text-red-500 text-sm italic ml-2">
                  {errors.email.message}
                </p>
              )}

              {/* Phone number */}
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    endContent={
                      <PhoneIcon className="text-3xl text-black font-bold pointer-events-none flex-shrink-0" />
                    }
                    label={
                      <span className="text-base text-black font-semibold">
                        Số điện thoại{' '}
                      </span>
                    }
                    placeholder="Nhập số điện thoại"
                    variant="bordered"
                    classNames={{
                      inputWrapper: 'bg-old-lace',
                    }}
                    {...register('phoneNumber')}
                    onChange={(e) => {
                      setValue('phoneNumber', e.target.value);
                      trigger('phoneNumber');
                    }}
                    isDisabled={modalStatus === 'view'}
                  />
                )}
              />

              {errors.phoneNumber && (
                <p className="text-red-500 text-sm italic ml-2">
                  {errors.phoneNumber.message}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              {modalStatus === 'view' ? null : (
                <Button
                  color="primary"
                  onClick={async () => {
                    const result = await trigger();

                    if (result) {
                      toast.promise(
                        onSubmit(),
                        {
                          loading: 'Đang cập nhật thông tin người dùng ...',
                          success: 'Cập nhật người dùng thành công!',
                          error: (err) => `${err}`,
                        },
                        {
                          style: {
                            minWidth: '300px',
                            minHeight: '50px',
                            textAlign: 'left',
                          },
                          position: 'bottom-right',
                        }
                      );
                    } else if (Object.keys(errors).length > 0) {
                      Object.values(errors).forEach((error) => {
                        toast.error(error.message, {
                          style: {
                            minWidth: '300px',
                            minHeight: '50px',
                          },
                          position: 'bottom-right',
                        });
                      });
                    }
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}

              <Button color="danger" variant="flat" onPress={handleClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditUserDialog;
