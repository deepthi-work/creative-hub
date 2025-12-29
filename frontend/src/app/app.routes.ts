import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Store } from './store/store';
import { Product } from './product/product';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'store', component: Store},
  { path: 'store/:id', component: Product },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup }
];
