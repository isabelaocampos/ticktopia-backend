import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from 'supertest';
import { AppModule } from "../../../src/app.module";
import { User } from "../../../src/auth/entities/user.entity";
import { Repository } from "typeorm";
import { ValidRoles } from "../../../src/auth/enums/valid-roles.enum";

const testingCreateUser = {
    email: 'guso@mail.com',
    password: 'Abc12345',
    name: 'Testing',
    lastname: 'user',
};

const testingCreateClient = {
    email: 'gusso@mail.com',
    password: 'Abc12345',
    name: 'Testing',
    lastname: 'user',
};


const testingCreateClient2 = {
    email: 'gusso2@mail.com',
    password: 'Abc12345',
    name: 'Testing',
    lastname: 'user',
};

var adminToken = "";
var userToken = "";
var userID = "";
var userID2 = "";

describe('UserModule FindOne (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );
        await app.init();
        userRepository = app.get<Repository<User>>(getRepositoryToken(User));

        const responseAdmin = await request(app.getHttpServer())
            .post('/auth/register')
            .send(testingCreateUser);
        adminToken = responseAdmin.body.token;

        const responseUser = await request(app.getHttpServer())
            .post('/auth/register')
            .send(testingCreateClient);

        const responseUser2 = await request(app.getHttpServer())
            .post('/auth/register')
            .send(testingCreateClient2);

        adminToken = responseAdmin.body.token;
        userToken = responseUser.body.token;
        userID = responseUser.body.user.id;
        userID2 = responseUser2.body.user.id;
        await userRepository.update(
            { email: testingCreateUser.email },
            { roles: ['admin'] },
        );
    }, 10000);

    afterEach(async () => {
        await userRepository.delete({ email: testingCreateUser.email });
        await userRepository.delete({ email: testingCreateClient.email });
        await userRepository.delete({ email: testingCreateClient2.email });

        await app.close();
    });

    it('/auth/users/:id (GET) - valid credentials - admin', async () => {
        const response = await request(app.getHttpServer())
            .get(`/auth/users/${userID2}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userID2,
            email: testingCreateClient2.email,
            roles: [ValidRoles.client]
        });
    });


    it('/auth/users/:id (GET) - valid credentials - user', async () => {
        const response = await request(app.getHttpServer())
            .get(`/auth/users/${userID}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: userID,
            email: testingCreateClient.email,
            roles: [ValidRoles.client]
        });
    });


    it('/auth/users/:id (GET) - invalid credentials - user', async () => {
        const response = await request(app.getHttpServer())
            .get(`/auth/users/${userID2}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "You can only find yourself",
            error: "Unauthorized",
            statusCode: 401
        });
    });

    it('/auth/users/:id (GET) - no credentials', async () => {
        const response = await request(app.getHttpServer())
            .get(`/auth/users/${userID}`)
            .send();
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Unauthorized",
            statusCode: 401
        });
    });




});