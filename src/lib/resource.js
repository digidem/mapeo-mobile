// @flow
export const resourceSuccess = (data: any) => ({
  status: 'Success',
  data
});

export const resourcePending = (data?: any) => ({
    status: 'Pending',
    data: data || undefined
  });

export const resourceFailed = (error: any, data?: any) => ({
  status: 'Failed',
  data,
  error
});

export default {
  resourceSuccess,
  resourcePending,
  resourceFailed
};
