import api from './axios';

// Fetch all sites
export const fetchSites = async (page = 1, limit = 10, search = '', status = '') => {
    const response = await api.get('/sites', {
        params: { page, limit, search, status }
    });
    return response.data;
};

// Fetch single site by ID
export const fetchSiteById = async (id) => {
    const response = await api.get(`/sites/${id}`);
    return response.data;
};

// Create a new site
export const createSite = async (siteData) => {
    const response = await api.post('/sites', siteData);
    return response.data;
};

export const createSiteFromQuotation = async (siteData) => {
    const response = await api.post('/sites/create-from-quotation', siteData);
    return response.data;
};
// Update an existing site
export const updateSite = async (id, siteData) => {
    const response = await api.put(`/sites/${id}`, siteData);
    return response.data;
};

// Delete a site
export const deleteSite = async (id) => {
    const response = await api.delete(`/sites/${id}`);
    return response.data;
};

// Fetch materials for a site
export const fetchSiteMaterials = async (siteId) => {
    const response = await api.get(`/sites/${siteId}/materials`);
    return response.data;
};

// Add material to site
export const addSiteMaterial = async (siteId, materialData) => {
    const response = await api.post(`/sites/${siteId}/materials`, materialData);
    return response.data;
};

// Delete material
export const deleteSiteMaterial = async (materialId) => {
    const response = await api.delete(`/sites/materials/${materialId}`);
    return response.data;
};
