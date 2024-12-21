"use client";

import { ImageCustom } from "@/components/ImageCustom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import React, { useState } from "react";

const MarkingSubmitModal = ({
  open,
  onClose,
  submitId,
  initialScore,
  studentName,
  submit,
}: {
  open: boolean;
  onClose: () => void;
  submitId: number;
  initialScore?: number | null;
  studentName?: string;
  submit?: string | null;
}) => {
  const [score, setScore] = useState<number>(initialScore || 0);
  const [comment, setComment] = useState<string>("");

  const renderFile: () => React.ReactElement = () => {
    if (!submit) return null;
    const filesArray = JSON.parse(submit.replace(/\\r\\n/g, ""));
    return filesArray.map(
      (file: { id: string; name: string; url: string }, index) => (
        <div key={`${submitId}_${index}`} className="flex items-center gap-2">
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
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-3">
        <p className="text-lg font-medium">Chấm điểm</p>
        <div className="space-y-3">
          <p className="text-base text-default-600">
            <i className="text-default-400">Tên học viên: </i>
            {studentName}
          </p>
          {renderFile()}
        </div>

        <div className="space-y-2">
          <div className="w-full">
            <p className="text-sm font-medium text-default-600">Điểm</p>
            <Input
              placeholder="Nhập điểm"
              value={score}
              onChange={(e) => setScore(Number.parseFloat(e.target.value))}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-default-600">Nhận xét</p>
            <Textarea
              placeholder="Nhận xét"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button>Nhập</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkingSubmitModal;
