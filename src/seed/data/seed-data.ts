
interface SeedUser {
    email: string;
    password: string;
    name: string;
    lastname: string;
    roles?: string[]
}

interface SeedEvent {
    name: string;
    bannerPhotoUrl: string;
    isPublic: boolean;
    totalTickets: number;
    availableTickets: number;
    userId: string; // Asume que el ID del usuario ya existe

}

interface SeedData {
    users: SeedUser[];
    events: SeedEvent[];
}

export const initialData: SeedData = {
    users: [
        {
            name: "Gustavo",
            email: "gus@gmail.com",
            password: "Hola1597!!!",
            lastname: "Gonzales"
        },
        {
            name: "David",
            email: "donney@gmail.com",
            password: "Hola1597!!!",
            lastname: "Donneys",
        },
        {
            name: "Isabella",
            email: "isabella.ocampo@u.icesi.edu.co",
            password: "Hola1597!!!",
            lastname: "Ocampo",
            roles: ["event-manager"]
        },
        {
            name: "Valentina",
            email: "valentina.gonzalez3@u.icesi.edu.co",
            password: "Hola1597!!!",
            lastname: "Gonzales"
        },
        {
            name: "Alejandro",
            email: "alejolonber@gmail.com",
            password: "Hola1597!!!",
            lastname: "Londoño"
        },
        {
            name: "Miguel",
            email: "miguegon@gmail.com",
            password: "Hola1597!!!",
            lastname: "Gonzales"
        },
        {
            name: "Samuel",
            email: "samubar@gmail.com",
            password: "Hola1597!!!",
            lastname: "Barrera",
            roles: ["event-manager"]
        },
        {
            name: "Sergio",
            email: "sergio@gmail.com",
            password: "Hola1597!!!",
            lastname: "Arboleda",
            roles: ["event-manager"]
        },
        {
            name: "Juan",
            email: "sebastian@gmail.com",
            password: "Hola1597!!!",
            lastname: "Barrera",
            roles: ["event-manager"]
        },
        {
            name: "Juan",
            email: "colonia@gmail.com",
            password: "Hola1597!!!",
            lastname: "Colonia",
            roles: ["event-manager"]
        },
        {
            name: "Alejandro",
            email: "alejitocordoba@hotmail.com",
            password: "Hola1597!!!",
            lastname: "Cordoba",
            roles: ["admin"]

        },

    ],

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

  
