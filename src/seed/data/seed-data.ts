
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
    events: [
        {
            name: "ANDRÉS CALAMARO: AGENDA 1999 TOUR",
            bannerPhotoUrl: "https://res.cloudinary.com/dnmlo67cy/image/upload/v1746554872/ltavyxu115tlpcvhjews.jpg",
            isPublic: true,
        },
        {
            name: "Debí Tirar Más Fotos World Tour",
            bannerPhotoUrl: "https://res.cloudinary.com/dnmlo67cy/image/upload/v1746655189/avljgk2jxugrtoyy1qmv.jpg",
            isPublic: true,
        },
        {
            name: "CAMILO | NUESTRO LUGAR FELIZ TOUR - CALI",
            bannerPhotoUrl: "https://res.cloudinary.com/dnmlo67cy/image/upload/v1746655493/u5dhbldu2ob7wjherfxf.jpg",
            isPublic: true,
        },
        {
            name: "REY RUIZ | SIEMPRE CONTIGO",
            bannerPhotoUrl: "https://res.cloudinary.com/dnmlo67cy/image/upload/v1746655833/wixrcw9ay0y4ilgzleqe.jpg",
            isPublic: true,
        },
        {
            name: "TRUENO",
            bannerPhotoUrl: "https://res.cloudinary.com/dnmlo67cy/image/upload/v1746656053/gwxuquxh1omlmifzh9lk.jpg",
            isPublic: true,
        }
    ]
}