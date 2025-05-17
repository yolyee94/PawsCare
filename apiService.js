// API Service for PawsCare
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api'; // Updated base URL to match your server
        this.mockData = {
            users: [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    phone: '1234567890'
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    password: 'password123',
                    phone: '0987654321'
                }
            ],
            pets: [
                {
                    id: '1',
                    name: 'Max',
                    type: 'dog',
                    breed: 'Labrador Retriever',
                    age: 3,
                    gender: 'male',
                    locality: 'Darjeeling Town',
                    vaccination: 'up-to-date',
                    image: 'images/default-pet.jpg',
                    vaccinationDoc: 'images/vaccination1.jpg'
                },
                // Add more mock pets as needed
            ],
            sitters: [
                {
                    id: 's1',
                    name: 'John Doe',
                    locality: 'Darjeeling Town',
                    experience: 5,
                    petTypes: ['dog', 'cat'],
                    rating: 4.8,
                    photo: 'images/default-avatar.jpg',
                    bio: 'Experienced pet sitter with love for all animals.',
                    reviews: []
                },
                // Add more mock sitters as needed
            ],
            walkers: [
                {
                    id: 'w1',
                    name: 'Jane Smith',
                    locality: 'Darjeeling Town',
                    experience: 3,
                    petTypes: ['dog', 'cat'],
                    schedule: ['morning', 'evening'],
                    rating: 4.9,
                    photo: 'images/default-avatar.jpg',
                    bio: 'Professional dog walker with a passion for pet care.',
                    reviews: []
                },
                // Add more mock walkers as needed
            ],
            contacts: [
                {
                    id: 'c1',
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    service: 'mating',
                    message: 'Looking for a Labrador mate for my female dog.',
                    date: '2024-04-10T10:30:00Z',
                    status: 'pending'
                },
                {
                    id: 'c2',
                    name: 'Bob Wilson',
                    email: 'bob@example.com',
                    service: 'sitting',
                    message: 'Need a pet sitter for my two cats next weekend.',
                    date: '2024-04-11T15:45:00Z',
                    status: 'responded'
                },
                {
                    id: 'c3',
                    name: 'Carol Davis',
                    email: 'carol@example.com',
                    service: 'walking',
                    message: 'Looking for a dog walker in the evenings.',
                    date: '2024-04-12T09:15:00Z',
                    status: 'pending'
                }
            ]
        };
    }

    // Updated API calls to use the correct endpoints
    async getPets(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.breed) queryParams.append('breed', filters.breed);
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.locality) queryParams.append('locality', filters.locality);
        const url = `${this.baseUrl}/petmates?${queryParams.toString()}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching pets:', error);
            // Fallback to mock data if API fails
            return this.getMockPets(filters);
        }
    }

    async getSitters(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.locality) queryParams.append('locality', filters.locality);
            if (filters.petType) queryParams.append('petType', filters.petType);
            
            const response = await fetch(`${this.baseUrl}/sitter?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching sitters:', error);
            // Fallback to mock data
            return this.getMockSitters(filters);
        }
    }

    async getWalkers(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.locality) queryParams.append('locality', filters.locality);
            if (filters.petType) queryParams.append('petType', filters.petType);

            const response = await fetch(`${this.baseUrl}/walker?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching walkers:', error);
            // Fallback to mock data
            return this.getMockWalkers(filters);
        }
    }

    async registerPet(petData) {
        try {
            const response = await fetch(`${this.baseUrl}/petmates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petData)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error registering pet:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async registerSitter(sitterData) {
        try {
            const response = await fetch(`${this.baseUrl}/sitter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sitterData)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error registering sitter:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async registerWalker(walkerData) {
        try {
            const response = await fetch(`${this.baseUrl}/walker`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(walkerData)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error registering walker:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async submitContactForm(contactData) {
        
        try {
            const response = await fetch(`${this.baseUrl}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error submitting contact form:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }


    async saveUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error saving user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error getting user:', error);
            // Fallback to mock data
            return this.getMockUser(userData);
        }
    }

    // Helper methods for mock data fallback
    getMockPets(filters) {
        let pets = [...this.mockData.pets];
        // Apply filters
        if (filters.type) pets = pets.filter(pet => pet.type === filters.type);
        if (filters.breed) pets = pets.filter(pet => pet.breed === filters.breed);
        if (filters.gender) pets = pets.filter(pet => pet.gender === filters.gender);
        if (filters.locality) pets = pets.filter(pet => pet.locality === filters.locality);
        return { success: true, data: pets };
    }

    getMockSitters(filters) {
        let sitters = [...this.mockData.sitters];
        if (filters.locality) sitters = sitters.filter(sitter => sitter.locality === filters.locality);
        if (filters.petType) sitters = sitters.filter(sitter => sitter.petTypes.includes(filters.petType));
        return { success: true, data: sitters };
    }

    getMockWalkers(filters) {
        let walkers = [...this.mockData.walkers];
        if (filters.locality) walkers = walkers.filter(walker => walker.locality === filters.locality);
        if (filters.petType) walkers = walkers.filter(walker => walker.petTypes.includes(filters.petType));
        return { success: true, data: walkers };
    }

    // Helper method for mock user authentication
    getMockUser(userData) {
        const user = this.mockData.users.find(u => 
            u.email === userData.email && u.password === userData.password
        );
        
        if (user) {
            return {
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            };
        }
        
        return {
            success: false,
            error: 'Invalid credentials'
        };
    }

    
    async forgotPassword(email) {
        console.log("in function "+ email)
        try {
            const response = await fetch(`${this.baseUrl}/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    error: errorData.message || 'An error occurred while processing your request.'
                };
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            return {
                success: false,
                error: 'An error occurred while processing your request.'
            };
        }
    }



    async resetPassword(email, newPassword, resetToken) {
        try {
            const response = await fetch(`${this.baseUrl}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, newPassword, resetToken })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    error: errorData.message || 'An error occurred while resetting your password.'
                };
            }

            const data = await response.json();
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return {
                success: false,
                error: 'An error occurred while resetting your password.'
            };
        }
    }
}

// Create a global instance
const apiService = new ApiService(); 