import api from './axios';

// Get all spaces for a quotation
export const fetchQuotationSpaces = async (quotationId) => {
    const response = await api.get(`/quotations/${quotationId}/spaces`);
    return response.data;
};

// Create a new space
export const createQuotationSpace = async (quotationId, spaceData) => {
    const response = await api.post(`/quotations/${quotationId}/spaces`, spaceData);
    return response.data;
};

// Update a space
export const updateQuotationSpace = async (spaceId, spaceData) => {
    const response = await api.put(`/quotation-spaces/${spaceId}`, spaceData);
    return response.data;
};

// Delete a space
export const deleteQuotationSpace = async (spaceId) => {
    const response = await api.delete(`/quotation-spaces/${spaceId}`);
    return response.data;
};

// Add work item to a space
export const addWorkItem = async (spaceId, workItemData) => {
    const response = await api.post(`/quotation-spaces/${spaceId}/workitems`, workItemData);
    return response.data;
};

// Update a work item
export const updateWorkItem = async (workItemId, workItemData) => {
    const response = await api.put(`/quotation-workitems/${workItemId}`, workItemData);
    return response.data;
};

// Delete a work item
export const deleteWorkItem = async (workItemId) => {
    const response = await api.delete(`/quotation-workitems/${workItemId}`);
    return response.data;
};

// Bulk update work items
export const bulkUpdateWorkItems = async (workItems) => {
    const response = await api.put('/quotation-workitems/bulk', { workItems });
    return response.data;
};
