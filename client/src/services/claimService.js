export const createClaim = (api, data) => api.post('/claims', data).then(r => r.data);
export const getClaimById = (api, id) => api.get(`/claims/${id}`).then(r => r.data);
export const getClaimsByUser = (api, userId) => api.get(`/claims/user/${userId}`).then(r => r.data);