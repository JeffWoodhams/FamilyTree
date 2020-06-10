import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RoutingService } from 'src/services/routing.service';
import { Person } from 'sdk';
import * as peopleData from '../../assets/People.json'

@Component({
  selector: 'app-family-circle',
  templateUrl: './family-circle.component.html',
  styleUrls: ['./family-circle.component.css']
})
export class FamilyCircleComponent implements OnInit {
//#region Variablea
@ViewChild('canvas', { static: true })
canvas: ElementRef<HTMLCanvasElement>;
private ctx: CanvasRenderingContext2D; private line: number = 20; 
private keyID: string; private family: Person[]; private generation1: Person[];private generation2: Person[];private generation3: Person[];private generation4: Person[];
private xCentre: number = 900; private yCentre: number = 500;
navigationSubscription: any;
//#endregion

  constructor(private route: ActivatedRoute, private routingService: RoutingService, private router: Router){
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.route.paramMap.subscribe(route => {
          this.keyID = route.get('personID')
        })
        this.family = (peopleData as any).default;
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        this.ctx.font = "15px Arial";
        this.DrawGenerations(this.keyID);
      }
    });
  }
  ngOnInit(): void {
  }
  private DrawGenerations(personID: string) {
    this.generation1 = [];
    this.generation2 = [];
    this.generation3 = [];
    var currentPerson = this.family.find(person => person.personID == personID);
    this.PersonDisplay(currentPerson,this.xCentre,this.yCentre);
    var mother = this.family.find(person => person.personID == currentPerson.motherID);
    if (mother) {
      this.generation1.push(mother);
      this.PersonDisplay(mother,this.xCentre,this.yCentre - 50);
      this.StraightConnect(this.xCentre + 50, this.yCentre - 45, this.xCentre + 50, this.yCentre - 15);
    }
    var father= this.family.find(person => person.personID == currentPerson.fatherID);
    if (father) {
      this.generation1.push(father);
      this.PersonDisplay(father,this.xCentre,this.yCentre + 50);
      this.StraightConnect(this.xCentre + 50, this.yCentre + 38, this.xCentre + 50, this.yCentre + 8);
    }
    var upDown: number = 1;
    var leftRight1: number = 1;
    var leftRight2: number = 1;
    for (let i = 0; i < 2; i++) {
      currentPerson = this.generation1[i];
      mother = this.family.find(person => person.personID == currentPerson.motherID)
      if (mother) {
      this.generation2.push(mother)
      this.PersonDisplay(mother,this.xCentre - 100, this.yCentre - 100 * upDown);
      this.Connect(this.xCentre + 50, this.yCentre - upDown * 65 - i * 10, this.xCentre - 50, this.yCentre - upDown * 95 - i * 10, upDown);
      }
      father = this.family.find(person => person.personID == currentPerson.fatherID)
      if (father) {
      this.generation2.push(father)
      this.PersonDisplay(father, this.xCentre + 100, this.yCentre - 100 * upDown);
      this.Connect(this.xCentre + 50, this.yCentre - upDown * 65 - i * 10, this.xCentre + 150, this.yCentre - upDown * 95 - i * 10, upDown);
      }
      for (let j = 0; j < 2; j++) {
        currentPerson = this.generation2[j];
        if (currentPerson) {
          mother = this.family.find(person => person.personID == currentPerson.motherID)
          if (mother) {
            this.generation3.push(mother)
            this.PersonDisplay(mother, this.xCentre - leftRight1 * 300 - 100, this.yCentre - 150 * upDown);
            this.Connect(this.xCentre + 50 - leftRight1 * 100, this.yCentre - upDown * 115 - i * 10, this.xCentre + 50 - leftRight1 * 400, this.yCentre - upDown * 145 - i * 10, upDown);
          }
          father = this.family.find(person => person.personID == currentPerson.fatherID)
          if (father) {
            this.generation3.push(father)
            this.PersonDisplay(father,this.xCentre - leftRight1 * 300 +  100, this.yCentre - 150 * upDown);
            this.Connect(this.xCentre + 50 - leftRight1 * 100, this.yCentre - upDown * 115 - i * 10, this.xCentre + 50 - leftRight1 * 200, this.yCentre - upDown * 145 - i * 10, upDown);
          }
        }
        for (let k = 0; k < 2; k++) {
          this.generation4= [];
          currentPerson = this.generation3[k];
          if (currentPerson) {
            mother = this.family.find(person => person.personID == currentPerson.motherID)
            if (mother) {
              this.generation4.push(mother)
              this.PersonDisplay(mother,this.xCentre - leftRight1 * 350 - leftRight2 * 150 - 80, this.yCentre - 200 * upDown);
              this.Connect(this.xCentre + 50 - leftRight1 * (k + 1) * 200, this.yCentre - upDown * 165 - i * 10,
                                  this.xCentre - leftRight1 * 350 + leftRight1 * leftRight2 * 150 - 30, this.yCentre - upDown * 195 - i * 10, upDown);
            }
            father = this.family.find(person => person.personID == currentPerson.fatherID)
            if (father) {
              this.generation4.push(father)
              this.PersonDisplay(father,this.xCentre - leftRight1 * 350 - leftRight2 * 150 +  80, this.yCentre - 200 * upDown);
              this.Connect(this.xCentre + 50 - leftRight1 * (k + 1) * 200, this.yCentre - upDown * 165 - i * 10,
                                this.xCentre - leftRight1 * 350 + leftRight1 * leftRight2 * 150 + 130, this.yCentre - upDown * 195 - i * 10, upDown);

            }
          }
          leftRight2 = -1;
        }
        this.generation3 = [];
        leftRight1 = -1;
        leftRight2 = 1;
      }
      this.generation2 = [];
      leftRight1 = 1;
      upDown = -1;
    }
  }
  private AddRoutingClick(xValue: number, yValue: number, routingService: RoutingService, personID: string) {
    var drawCanvas = this.ctx.canvas, elements = [];
    elements.push({
      width: 200,
      height: 50,
      top: yValue - 30,
      left: xValue,
      person: personID
    });
    drawCanvas.addEventListener('click', function (event) {
      var xVal = event.pageX, yVal = event.pageY;
      for (let ele of elements){
        if (yVal > ele.top && yVal < ele.top + ele.height && xVal > ele.left && xVal < ele.left + ele.width) {
          routingService.open(ele.person);
          break
        }
      }
    }, false);
    drawCanvas.addEventListener('contextmenu', function (event) {
      var xVal = event.pageX, yVal = event.pageY;
      for (let ele of elements){
        if (yVal > ele.top && yVal < ele.top + ele.height && xVal > ele.left && xVal < ele.left + ele.width) {
          routingService.openRight(ele.person);
          break
        }
      }
    }, false);
  }
  private StraightConnect(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
  private Connect(x1: number, y1: number, x2: number, y2: number, upDown: number) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x1, y1 - upDown * 15);
    this.ctx.lineTo(x2, y1 - upDown * 15);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private PersonDisplay(person: Person, xPosition: number, yPosition: number, ) {
    this.ctx.fillText(person.name.split(' ',1) + " " + person.surname, xPosition, yPosition);
    this.AddRoutingClick(xPosition, yPosition, this.routingService, person.personID)
  }
}