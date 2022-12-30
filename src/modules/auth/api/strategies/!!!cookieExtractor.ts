import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const cookieExtractor = (ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  let token = null;
  if (request && request.cookies) {
    token = request.cookies['refreshToken'];
  }
  return token;
};

module.exports = cookieExtractor;

//
// const cookieExtractor = (req) => {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['refreshToken'];
//   }
//   return token;
// };
//
// module.exports = cookieExtractor;
