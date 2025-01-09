"use client";
import { Controller, useForm } from "react-hook-form";
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
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FileDialog } from "@/components/FileDialog";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useParams } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "@/lib/fetch";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface IForm {
  name: string;
  moduleId: number;
  skillId: number;
  bandScoreId: number;
  percentage: string;
  files: string;
}

const modules = [
  { id: 1, module: "IELTS" },
  { id: 2, module: "TOEIC" },
];
const skills = [
  { id: 1, skill: "Listening" },
  { id: 2, skill: "Reading" },
  { id: 3, skill: "Writing" },
  { id: 4, skill: "Speaking" },
];
const bands = [
  { id: 1, moduleId: 1, band: "5.0" },
  { id: 2, moduleId: 1, band: "6.0" },
  { id: 3, moduleId: 1, band: "7.0" },
  { id: 4, moduleId: 1, band: "8.0" },
  { id: 5, moduleId: 2, band: "500" },
  { id: 6, moduleId: 2, band: "600" },
  { id: 7, moduleId: 2, band: "700" },
  { id: 8, moduleId: 2, band: "800" },
];

const CreateAssignmentModal = ({ isOpen, onClose }) => {
  const { handleSubmit, control } = useForm<IForm>({});
  const { slug } = useParams();

  const [loading, setLoading] = React.useState(false);

  const { startUpload } = useUploadThing("courseAttachment");

  const [files, setFiles] = React.useState([]);

  const [openFilePicker, setOpenFilePicker] = useState(false);

  const { mutate, isLoading: isMutationLoading } = useMutation({
    mutationFn: (
      data: IForm & {
        courseId: string;
      }
    ) =>
      postRequest({
        endPoint: "/api/assignment",
        formData: data,
        isFormData: false,
      }),
  });

  const onSubmit = async (data: IForm) => {
    setLoading(true);

    const newFiles = files.filter((file) => file instanceof File);

    const jsonFiles = await startUpload([...newFiles]).then((res) => {
      console.log("res: ", res);
      const ret = res?.map((file) => ({
        id: file.key,
        name: file.name,
        url: file.url,
      }));

      return ret ?? [];
    });

    const submitData = {
      ...data,
      courseId: slug as string,
      files: JSON.stringify(jsonFiles),
    };

    mutate(submitData);

    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="top-center"
      scrollBehavior="outside"
      size="xl"
      backdrop="blur"
      isDismissable={false}
      hideCloseButton={true}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1 items-center">
            <div className="mt-2">Tạo bài tập mới</div>
          </ModalHeader>
          <ModalBody>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    autoFocus
                    label={
                      <span className="text-base text-black">
                        Tên bài tập <span className="text-red-500">(*)</span>
                      </span>
                    }
                  />
                  {error && (
                    <p className="text-red-500 text-sm italic ml-2">
                      {error.message}
                    </p>
                  )}
                </>
              )}
            />

            <Controller
              name="percentage"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    type="number"
                    autoFocus
                    label={
                      <span className="text-base text-black">
                        Trọng số bài tập{" "}
                        <span className="text-red-500">(*)</span>
                      </span>
                    }
                  />
                  {error && (
                    <p className="text-red-500 text-sm italic ml-2">
                      {error.message}
                    </p>
                  )}
                </>
              )}
            />

            <Controller
              name="moduleId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className=""
                  label={
                    <span className="text-base text-black">
                      Chọn một module <span className="text-red-500">(*)</span>
                    </span>
                  }
                >
                  {modules.map((item) => (
                    <SelectItem key={item.id}>{item.module}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="bandScoreId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className=""
                  label={
                    <span className="text-base text-black">
                      Chọn một mức điểm đầu ra{" "}
                      <span className="text-red-500">(*)</span>
                    </span>
                  }
                >
                  {bands.map((item) => (
                    <SelectItem key={item.id}>{item.band}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="skillId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className=""
                  label={
                    <span className="text-base text-black">
                      Chọn một kĩ năng <span className="text-red-500">(*)</span>
                    </span>
                  }
                >
                  {skills.map((item) => (
                    <SelectItem key={item.id}>{item.skill}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="flex gap-5 items-center">
              <Button
                className="text-orange w-32 h-32 flex flex-col bg-transparent"
                onClick={() => {
                  setOpenFilePicker(true);
                }}
              >
                <FaFileCirclePlus size={80} />
                <span className="font-bold">Thêm tài liệu</span>
              </Button>
              <div className="space-y-2">
                {files.map((item: File, index) => (
                  <div className="flex items-center gap-1">
                    <p className="italic text-gray-500">{item.name}</p>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setFiles((prev) => {
                          const newFiles = [...prev];
                          newFiles.splice(index, 1);
                          return newFiles;
                        });
                      }}
                    >
                      <IoMdCloseCircle />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading || isMutationLoading}
              type="submit"
              color="primary"
            >
              Thêm
            </Button>

            <Button color="danger" variant="flat" onPress={onClose}>
              Đóng
            </Button>
          </ModalFooter>

          {openFilePicker && (
            <FileDialog
              name="Images"
              maxFiles={4}
              maxSize={1024 * 1024 * 4}
              files={files}
              setFiles={setFiles as any}
              disabled={false}
              open={openFilePicker}
              onOpenChange={() => setOpenFilePicker(false)}
            />
          )}
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateAssignmentModal;
