import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // ถ้ามี token และ decode สำเร็จ → return user
    // ถ้าไม่มี token หรือ decode ไม่ได้ → return null (ไม่ throw error)
    return user ?? null;
  }
}

