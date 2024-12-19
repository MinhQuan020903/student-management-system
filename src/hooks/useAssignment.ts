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

  const onGetAssignmentById = async (id: number) => {
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
    onUpdateAssignment,
    onGetMultipleChoiceQuestion,
    onPostMultipleChoiceQuestion,
    onPostMultipleChoiceQuestionResult,
    onGetAssignmentFromUserIdAndCourseId,
    onUpdateAssignmentUp,
  };
};
