
interface SeedStudent {

    email: string;
    password: string;
    name: string;
    lastname: string;
    roles?: string[]
}

interface SeedData {
    users: SeedStudent[];
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

    ]
}