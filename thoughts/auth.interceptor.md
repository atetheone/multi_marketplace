// core/interceptors/auth.interceptor.ts

# AuthInterceptor

L'intercepteur `AuthInterceptor` permet d'ajouter un token d'authentification à chaque requête HTTP sortante. Il est également possible de gérer les erreurs 401 (non autorisé) pour effectuer des actions spécifiques comme la déconnexion de l'utilisateur.

## Création de l'intercepteur

```bash
ng generate interceptor interceptors/auth
```

## Implémentation de l'intercepteur


```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        'X-Tenant-ID': this.authService.getCurrentTenantId()
      }
    });

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Gestion du refresh token ou déconnexion
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
```
