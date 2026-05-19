import api from './axios';

// Get all spaces for a package
export const fetchPackageSpaces = async (packageId) => {
    const response = await api.get(`/packages/${packageId}/spaces`);
    return response.data;
};

// Create a new space
export const createPackageSpace = async (packageId, spaceData) => {
    const response = await api.post(`/packages/${packageId}/spaces`, spaceData);
    return response.data;
};

// Update a space
export const updatePackageSpace = async (spaceId, spaceData) => {
    const response = await api.put(`/spaces/${spaceId}`, spaceData);
    return response.data;
};

// Delete a space
export const deletePackageSpace = async (spaceId) => {
    const response = await api.delete(`/spaces/${spaceId}`);
    return response.data;
};

// Add work item to a space
export const addWorkItem = async (spaceId, workItemData) => {
    const response = await api.post(`/spaces/${spaceId}/workitems`, workItemData);
    return response.data;
};

// Update a work item
export const updateWorkItem = async (workItemId, workItemData) => {
    const response = await api.put(`/workitems/${workItemId}`, workItemData);
    return response.data;
};

// Delete a work item
export const deleteWorkItem = async (workItemId) => {
    const response = await api.delete(`/workitems/${workItemId}`);
    return response.data;
};

// Bulk update work items
export const bulkUpdateWorkItems = async (workItems) => {
    const response = await api.put(`/workitems/bulk`, { workItems });
    return response.data;
};

// Get package details (including notes)
export const fetchPackage = async (packageId) => {
    const response = await api.get(`/packages/${packageId}`);
    return response.data;
};

// Update package details
export const updatePackage = async (packageId, packageData) => {
    const response = await api.put(`/packages/${packageId}`, packageData);
    return response.data;
};
