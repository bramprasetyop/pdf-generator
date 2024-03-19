import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
    } catch (error) {
      return false;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    // const decodedToken: any = jwt.decode(accessToken);
    request.user = {
      CLAIM: ['CLAIM_CAN_VIEW', 'CLAIM_CAN_CREATE'],
      PDF: ['PDF_CAN_CREATE']
    };

    try {
      const isValidToken = await this.verifyToken(accessToken);
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
