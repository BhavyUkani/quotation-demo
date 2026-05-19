import api from './axios';

// Fetch all clients
export const fetchClients = async () => {
    const response = await api.get('/clients');
    return response.data;
};

// Create a new client
export const createClient = async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
};

// Update an existing client
export const updateClient = async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
};

// Delete a client
export const deleteClient = async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
};

// Add a note
export const addNote = async (clientId, note) => {
    const response = await api.post(`/clients/${clientId}/notes`, { note });
    return response.data;
};



// Delete a note
export const deleteNote = async (noteId) => {
    const response = await api.delete(`/clients/notes/${noteId}`);
    return response.data;
};
