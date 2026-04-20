export const getUsers = (api, role) => api.get('/users', { params: { role } }).then(r => r.data);
export const getUserById = (api, id) => api.get(`/users/${id}`).then(r => r.data);
export const createUser = (api, data) => api.post('/users', data).then(r => r.data);