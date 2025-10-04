import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ScoreRemoverInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const isLoggedIn = !!req.user?.username;

    if (isLoggedIn) {
      return next.handle();
    }
    
   return next.handle().pipe(
      map((repo) => {
        // ถ้า response มี data เป็น array → ลบ score เฉพาะใน data
        if (repo?.data && Array.isArray(repo.data)) {
          const strippedData = repo.data.map(item => {
            if (item && typeof item === 'object' && 'score' in item) {
              const { score, ...rest } = item;
              return rest;
            }
            return item;
          });

          return { ...repo, data: strippedData };
        }

        // fallback: ถ้า response เป็น array หรือ object เดี่ยว
        return this.stripScore(repo);
      })
    );
  }

  private stripScore = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map(this.stripScore);
    }

    if (value && typeof value === 'object' && 'score' in value) {
      const { score, ...rest } = value;
      return rest;
    }

    return value;
  };
}

