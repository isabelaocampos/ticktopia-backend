
interface SeedEvent {
    name: string;
    bannerPhotoUrl: string;
    isPublic: boolean;
    totalTickets: number;
    availableTickets: number;
    userId: string; // Asume que el ID del usuario ya existe

}
interface SeedData {
    events: SeedEvent[];
}

export const initialData: SeedData = {
    events: [ {
        name: 'Tech Conference 2025',
        bannerPhotoUrl: 'https://example.com/banner1.jpg',
        isPublic: true,
        totalTickets: 100,
        availableTickets: 100,
        userId: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',  // Asume que el ID del usuario ya existe
      },
      {
        name: 'Coding Bootcamp',
        bannerPhotoUrl: 'https://example.com/banner2.jpg',
        isPublic: true,
        totalTickets: 50,
        availableTickets: 50,
        userId: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',  // Asume que el ID del usuario ya existe
      },

    ]
}

  
