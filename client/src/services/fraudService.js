export const analyzeClaim = (api, claimId) => api.post(`/fraud/analyze/${claimId}`).then(r => r.data);
export const getFraudsByClaim = (api, claimId) => api.get(`/fraud/claim/${claimId}`).then(r => r.data);
export const markFraud = (api, alertId, fraud) => api.put(`/fraud/${alertId}`, null, { params: { fraud } }).then(r => r.data);