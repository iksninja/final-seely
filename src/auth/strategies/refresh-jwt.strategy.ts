import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggedInDto } from '../dto/logged-in.dto';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt'
){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.refreshToken || '',
            ]),
            secretOrKey: `${process.env.REFRESH_JWT_SECRET}`,
        });
    }

    validate(user: LoggedInDto): LoggedInDto {
        return { username: user.username, role: user.role };
    }
}
