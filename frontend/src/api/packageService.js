import api from './axios';

// Fetch all packages
export const fetchPackages = async (page = 1, limit = 10, search = '', category = '') => {
    const response = await api.get('/packages', {
        params: { page, limit, search, category }
    });
    return response.data;
};

// Get single package by ID
export const fetchPackageById = async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
};

// Create a new package
export const createPackage = async (packageData) => {
    const response = await api.post('/packages', packageData);
    return response.data;
};

// Update an existing package
export const updatePackage = async (id, packageData) => {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
};

// Delete a package
export const deletePackage = async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
};
