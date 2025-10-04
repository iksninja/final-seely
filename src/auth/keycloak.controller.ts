import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { KeycloakService } from './keycloak.service';

@Controller('keycloak')
export class KeycloakController {

constructor(private keycloakService: KeycloakService) {}

    @Get('redirect-to-login')
    async redirectToLogin(@Res({ passthrough: true }) res: Response)  {
         const { state, codeVerifier, url } = await this.keycloakService.getRedirectLoginUrl()

         res.cookie('state', state)
         res.cookie('codeVerifier', codeVerifier)

         return { url }
    }

    @Get('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response){

        const state = req.cookies?.state;
        const codeVerifier = req.cookies?.codeVerifier;
         const url = req.originalUrl.split('?')[1] || '';

        const { idToken, tokensDto } = await this.keycloakService.login({
            state,
            codeVerifier,
            url,
        });

        res.cookie('idToken', idToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 1000 * 60 * 5 })
        res.cookie('refreshToken', tokensDto.refreshToken)

        res.clearCookie('state')
        res.clearCookie('codeVerifier')

        return { accessToken: tokensDto.accessToken };     
    }
}
