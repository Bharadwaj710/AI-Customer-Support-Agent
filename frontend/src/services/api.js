const API_BASE_URL = 'https://ai-customer-support-agent-0kch.onrender.com';

export const getHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error('Failed to fetch health status');
    }
    return response.json();
};

export const sendMessage = async (message, name = null, email = null) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, name, email }),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
};

export const createTicket = async (name, email, issue) => {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, issue }),
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return response.json();
};
