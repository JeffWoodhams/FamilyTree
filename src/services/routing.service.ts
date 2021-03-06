import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutingService {
    constructor(private router: Router, private route: ActivatedRoute){}
    private routes: any[] = [];


    open(personID: string) {
        this.router.navigate(['family-chart/',personID]);
    }
    openChart(personID: string) {
        this.router.navigate(['family-circle/',personID]);
    }


}