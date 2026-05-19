import api from './axios';

// Fetch all leads
// Fetch all leads with pagination and filters
export const fetchLeads = async (page = 1, limit = 10, search = '', status = 'all') => {
    const response = await api.get('/leads', {
        params: { page, limit, search, status }
    });
    return response.data;
};

// Create a new lead
export const createLead = async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
};

// Update an existing lead
export const updateLead = async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
};

// Delete a lead
export const deleteLead = async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
};

// Convert lead to client
export const convertLeadToClient = async (id) => {
    const response = await api.post(`/leads/${id}/convert`, {});
    return response.data;
};

// Fetch employees (for assignment)
export const fetchEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};
