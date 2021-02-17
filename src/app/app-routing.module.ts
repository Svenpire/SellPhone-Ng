import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PhoneEstimatorComponent } from './components/phone-estimator/phone-estimator.component';
import { SaleCalculatorComponent } from './components/sale-calculator/sale-calculator.component';
import { SearchResultsComponent } from './components/search-results/app-search-results.component';


const routes: Routes = [
  { path: '', component: PhoneEstimatorComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'sellmyphone', component: SaleCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
