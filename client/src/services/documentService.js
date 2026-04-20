export const uploadDocument = (api, data) => api.post('/documents', data).then(r => r.data);
export const getDocumentsByClaim = (api, claimId) => api.get(`/documents/claim/${claimId}`).then(r => r.data);
export const verifyDocument = (api, id, approved) => api.put(`/documents/${id}/verify`, null, { params: { approved } }).then(r => r.data);