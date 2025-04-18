// API Service for PawsCare
class ApiService {
    constructor() {
        this.baseUrl = 'https://api.pawscare.com'; // Replace with your friend's API URL
        this.mockData = {
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

    // Mock API calls - Replace these with actual API calls when available
    async getPets(filters = {}) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let pets = [...this.mockData.pets];
        
        // Apply filters
        if (filters.type) {
            pets = pets.filter(pet => pet.type === filters.type);
        }
        if (filters.breed) {
            pets = pets.filter(pet => pet.breed === filters.breed);
        }
        if (filters.gender) {
            pets = pets.filter(pet => pet.gender === filters.gender);
        }
        if (filters.locality) {
            pets = pets.filter(pet => pet.locality === filters.locality);
        }
        
        return {
            success: true,
            data: pets
        };
    }

    async getSitters(filters = {}) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let sitters = [...this.mockData.sitters];
        
        if (filters.locality) {
            sitters = sitters.filter(sitter => sitter.locality === filters.locality);
        }
        if (filters.petType) {
            sitters = sitters.filter(sitter => sitter.petTypes.includes(filters.petType));
        }
        
        return {
            success: true,
            data: sitters
        };
    }

    async getWalkers(filters = {}) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let walkers = [...this.mockData.walkers];
        
        if (filters.locality) {
            walkers = walkers.filter(walker => walker.locality === filters.locality);
        }
        if (filters.petType) {
            walkers = walkers.filter(walker => walker.petTypes.includes(filters.petType));
        }
        
        return {
            success: true,
            data: walkers
        };
    }

    async registerPet(petData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newPet = {
            id: Date.now().toString(),
            ...petData
        };
        
        this.mockData.pets.push(newPet);
        
        return {
            success: true,
            data: newPet
        };
    }

    async registerSitter(sitterData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newSitter = {
            id: 's' + Date.now().toString(),
            ...sitterData
        };
        
        this.mockData.sitters.push(newSitter);
        
        return {
            success: true,
            data: newSitter
        };
    }

    async registerWalker(walkerData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newWalker = {
            id: 'w' + Date.now().toString(),
            ...walkerData
        };
        
        this.mockData.walkers.push(newWalker);
        
        return {
            success: true,
            data: newWalker
        };
    }

    async addReview(reviewData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { id, type, rating, text } = reviewData;
        const collection = type === 'sitter' ? this.mockData.sitters : this.mockData.walkers;
        const item = collection.find(x => x.id === id);
        
        if (item) {
            const review = {
                rating,
                text,
                date: new Date().toISOString(),
                id: Date.now().toString()
            };
            
            item.reviews.push(review);
            item.rating = item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length;
            
            return {
                success: true,
                data: review
            };
        }
        
        return {
            success: false,
            error: 'Item not found'
        };
    }

    async submitContactForm(contactData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newContact = {
            id: 'c' + Date.now().toString(),
            ...contactData,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        this.mockData.contacts.push(newContact);
        
        return {
            success: true,
            data: newContact
        };
    }

    async getContactMessages(filters = {}) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let contacts = [...this.mockData.contacts];
        
        // Apply filters
        if (filters.status) {
            contacts = contacts.filter(contact => contact.status === filters.status);
        }
        if (filters.service) {
            contacts = contacts.filter(contact => contact.service === filters.service);
        }
        if (filters.dateFrom) {
            contacts = contacts.filter(contact => new Date(contact.date) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            contacts = contacts.filter(contact => new Date(contact.date) <= new Date(filters.dateTo));
        }
        
        return {
            success: true,
            data: contacts
        };
    }

    async updateContactStatus(id, status) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const contact = this.mockData.contacts.find(c => c.id === id);
        if (contact) {
            contact.status = status;
            return {
                success: true,
                data: contact
            };
        }
        
        return {
            success: false,
            error: 'Contact message not found'
        };
    }
}

// Create a global instance
const apiService = new ApiService(); 