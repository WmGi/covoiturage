import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  auth=this.authService.userIsAuthenticated;
  constructor(
    private platform: Platform,
   private authService: AuthService,
   private router: Router) {
     this.initializeAppp();

    }
   initializeAppp() {
     this.platform.ready().then(() => {
       if (Capacitor.isPluginAvailable('SplashScreen')) {
         Plugins.SplashScreen.hide();
       }
     });
   }

   onLogout() {
     this.authService.logout();
     this.router.navigateByUrl('/auth');
   }
}
