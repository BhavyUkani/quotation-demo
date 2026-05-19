import api from './axios';

// Get all quotations
export const getAllQuotations = async (page = 1, limit = 10, search = '', status = '') => {
    const response = await api.get('/quotations', {
        params: { page, limit, search, status }
    });
    return response.data;
};

// Update quotation status
export const updateQuotationStatus = async (id, status) => {
    const response = await api.patch(`/quotations/${id}/status`, { status });
    return response.data;
};

// Delete quotation
export const deleteQuotation = async (id) => {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
};

// Duplicate quotation
export const duplicateQuotation = async (id) => {
    const response = await api.post(`/quotations/${id}/copy`);
    return response.data;
};

// Download PDF
// Download PDF
export const downloadQuotationPDF = async (id, onProgress) => {
    const response = await api.get(`/pdf/${id}`, {
        responseType: 'blob',
        onDownloadProgress: onProgress
    });
    return response;
};
