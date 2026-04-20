export const createPolicy = (api, data) => api.post('/policies', data).then(r => r.data);
export const getPolicyById = (api, id) => api.get(`/policies/${id}`).then(r => r.data);
export const getPoliciesByUser = (api, userId) => api.get(`/policies/user/${userId}`).then(r => r.data);
export const getPoliciesByStatus = (api, status) => api.get('/policies/status', { params: { status } }).then(r => r.data);
export const updatePolicy = (api, id, data) => api.put(`/policies/${id}`, data).then(r => r.data);
export const updatePolicyStatus = (api, id, status) => api.patch(`/policies/${id}/status`, null, { params: { status } }).then(r => r.data);