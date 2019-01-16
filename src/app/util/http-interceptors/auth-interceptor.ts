import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../../acceso-datos/seguridad/auth.service";
import { Urls } from "../../acceso-datos/util/urls";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        //Si se solicita loguearse nuevamente no envio el token de acceso
        if (req.url.endsWith(Urls.TOKEN)) {
            return next.handle(req);
        }
        const usuarioAuth = this.auth.getUsuarioAuth();

        if (usuarioAuth) {
            //Clonando la Request y estableciendo la cabecera de Authorization con Bearer
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${usuarioAuth.access_token}`)
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}
