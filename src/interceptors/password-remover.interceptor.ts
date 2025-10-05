import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class PasswordRemoverInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((repo) => {
        if (Array.isArray(repo)) {
          return repo.map(v=> {
            if ((v && typeof v === 'object' && 'password' in v) || (v && typeof v === 'object' && 'keycloakId' in v)) {
              const { password, keycloakId, ...rest } = v;
              return rest;
            }
            return v;
          });
        } else if ((repo && typeof repo === 'object' && 'password' in repo) || (repo && typeof repo === 'object' && 'keycloakId' in repo)) {
          const { password, keycloakId, ...rest } = repo;
              return rest;
            }
        // if ('password' in repo) {
        //   const { password, ...rest } = repo
        //   return rest;
        // }
        return repo;
      })
    );
  }
}
