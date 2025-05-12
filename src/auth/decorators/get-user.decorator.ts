// get-user.decorator.ts
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const getUserDecoratorFactory = (data: string | undefined, context: ExecutionContext): any => {
  const req = context.switchToHttp().getRequest<{ user?: any| null }>(); 
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException(`User not found`);
  }

  return!data? user : user[data];
};

export const GetUser = createParamDecorator(getUserDecoratorFactory);