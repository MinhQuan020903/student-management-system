import { getRequest, postRequest } from '@/lib/fetch';

export const useAssignment = () => {
  const onGetAssignment = async (
    page: number,
    limit: number,
    moduleId: number,
    skillId: number,
    bandScoreId: number
  ) => {
    const res = await getRequest({
      endPoint: `/api/assignment/all?page=${page}&limit=${limit}&moduleId=${moduleId}&skillId=${skillId}&bandScoreId=${bandScoreId}`,
    });
    console.log(
      '🚀 ~ file: useAssignment.ts:14 ~ useAssignment ~ endPoint:',
      `/api/assignment/all?page=${page}&limit=${limit}&moduleId=${moduleId}&skillId=${skillId}&bandScoreId=${bandScoreId}`
    );
    console.log('🚀 ~ file: useAssignment.ts:14 ~ useAssignment ~ res:', res);

    // return {
    //   data: res.data,
    //   totalPages: Math.round(res.totalPages),
    //   totalItems: res.totalItems,
    // };
    return res;
  };

  const onGetAssignmentByCourse = async (
    page: number,
    limit: number,
    moduleId: number,
    skillId: number,
    bandScoreId: number,
    courseId: number
  ) => {
    const res = await getRequest({
      endPoint: `/api/assignment/course?page=${page}&limit=${limit}&moduleId=${moduleId}&skillId=${skillId}&bandScoreId=${bandScoreId}&courseId=${courseId}`,
    });

    console.log('🚀 ~ file: useAssignment.ts:14 ~ useAssignment ~ res:', res);

    // return {
    //   data: res.data,
    //   totalPages: Math.round(res.totalPages),
    //   totalItems: res.totalItems,
    // };
    return res;
  };

  const onGetAssignmentById = async (id: number) => {
    console.log(
      '🚀 ~ file: onGetAssignmentById useAssignment.ts:51 ~ useAssignment ~ id:',
      id
    );
    const res = await getRequest({
      endPoint: `/api/assignment?id=${id}`,
    });

    return res;
  };

  const onUpdateAssignment = async (data: any) => {
    const res = await postRequest({
      endPoint: `/api/assignment`,
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const onGetMultipleChoiceQuestion = async (
    id: number,
    page: number,
    limit: number
  ) => {
    const res = await getRequest({
      endPoint: `/api/assignment/multiple-choice-question?assignmentId=${id}&page=${page}&limit=${limit}`,
    });

    return res;
  };

  const onPostMultipleChoiceQuestion = async (data) => {
    console.log(
      '🚀 ~ file: useAssignment.ts:58 ~ onPostMultipleChoiceQuestion ~ data:',
      data
    );
    const question = await postRequest({
      endPoint: '/api/assignment/multiple-choice-question',
      formData: data,
      isFormData: true,
    });
    console.log(question);
    return question;
  };

  const onPostMultipleChoiceQuestionResult = async (data) => {
    const answer = await postRequest({
      endPoint: '/api/assignment/multiple-choice-question/result',
      formData: data,
      isFormData: true,
    });
    return answer;
  };

  const onGetAssignmentFromUserIdAndCourseId = async (
    page: number,
    limit: number,
    search: string,
    userId: number,
    courseId: number
  ) => {
    const res = await getRequest({
      endPoint: `/api/assignment/user?page=${page}&limit=${limit}&search=${search}&userId=${userId}&courseId=${courseId}`,
    });

    return res;
  };

  const onGetAssignmentFromUser = async (
    page: number,
    limit: number,
    search: string,
    userId: number
  ) => {
    const res = await getRequest({
      endPoint: `/api/assignment/user?page=${page}&limit=${limit}&search=${search}&userId=${userId}`,
    });

    return res;
  };

  const onGetAssignmentFromUsersByAssignmentId = async (
    page: number,
    limit: number,
    search: string,
    assignmentId: number
  ) => {
    const res = await getRequest({
      endPoint: `/api/assignment/user/all?page=${page}&limit=${limit}&search=${search}&assignmentId=${assignmentId}`,
    });

    return res;
  };

  const onPostAssignmentUserResult = async (assignmentUserId, data) => {
    console.log(
      '🚀 ~ file: useAssignment.ts:145 ~ onPutAssignmentUserResult ~ data:',
      data
    );
    const result = await postRequest({
      endPoint: `/api/assignment/user?assignmentUserId=${assignmentUserId}`,
      formData: data,
      isFormData: false,
    });
    console.log(result);
    return result;
  };

  const onUpdateAssignmentUp = async (data: any) => {
    console.log(
      '🚀 ~ file: useAssignment.ts:94 ~ onUpdateAssignmentUp ~ data:',
      data
    );
    const res = await postRequest({
      endPoint: `/api/assignment/up`,
      isFormData: false,
      formData: data,
    });

    console.log(
      '🚀 ~ file: useAssignment.ts:104 ~ onUpdateAssignmentUp ~ res:',
      res
    );
    return res;
  };

  return {
    onGetAssignment,
    onGetAssignmentById,
    onGetAssignmentByCourse,
    onUpdateAssignment,
    onGetMultipleChoiceQuestion,
    onPostMultipleChoiceQuestion,
    onPostMultipleChoiceQuestionResult,
    onGetAssignmentFromUserIdAndCourseId,
    onUpdateAssignmentUp,
    onGetAssignmentFromUser,
    onGetAssignmentFromUsersByAssignmentId,
    onPostAssignmentUserResult,
  };
};
