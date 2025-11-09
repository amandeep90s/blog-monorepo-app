import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import express from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Request() req: express.Request,
    @Res() res: express.Response,
  ) {
    const userData = await this.authService.login(req.user as User);

    const avatarParam = userData.avatar
      ? `&avatar=${encodeURIComponent(userData.avatar)}`
      : '';

    res.redirect(
      `http://localhost:3000/api/google/callback?userId=${userData.id}&name=${encodeURIComponent(userData.name)}${avatarParam}&accessToken=${userData.accessToken}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verify() {
    return 'ok';
  }
}
