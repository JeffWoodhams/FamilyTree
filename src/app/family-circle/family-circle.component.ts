import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RoutingService } from 'src/services/routing.service';
import { Person } from 'sdk';
import { start } from 'repl';
import { count } from 'console';
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
private ctx: CanvasRenderingContext2D; 
private drawWidth: number = 1900; private drawHeight: number = 900;
private scale = 4;S
navigationSubscription: any;
private family: Person[];
private xPosn: number; private yPosn: number; private prevxPosn2: number; private prevyPosn2: number;private prevxPosn3: number; private prevyPosn3: number;
private prevxPosn4: number; private prevyPosn4: number;private prevxPosn5: number; private prevyPosn5: number;
private upDown: number = -1; private ySeparation  = 55; private line: number = 15;
private startPersonID: string = "SheilaMaryPreece1953"; private currentPerson: Person; private previousPerson2: Person;private previousPerson3: Person;
private previousPerson4: Person;private previousPerson5: Person;
private count2: number = 1;private count3: number = 1;private count4: number = 1;private count5: number = 1;
//#endregion

  constructor(private route: ActivatedRoute, private routingService: RoutingService, private router: Router){
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.family = (peopleData as any).default;
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        this.ctx.fillStyle = "Linen";
        this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        this.ctx.font = "24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "RebeccaPurple";
        this.ctx.fillText("Welcome to the Preece - Woodhams Family Tree", this.drawWidth/2, 40);
        this.ctx.font = "18px Arial";
        this.ctx.fillText("Please click on a name in the tree to start a more detailed exploration", this.drawWidth/2, 70);
        this.ctx.font = "15px Arial";
        this.DrawGenerations();
      }
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(route => {
      if (route.get('personID') != null) {
        this.router.navigate(['family-chart/',route.get('personID')]);
      }
    });
  }
  private DrawGenerations() {
    for (let i = 0; i < 2; i++) {
      let startPerson = this.family.find(person => person.personID == this.startPersonID)
      for (let j = 1; j < 4; j += 2) {
        this.xPosn = this.drawWidth * j /this.scale;
        this.yPosn = this.drawHeight/2 + this.upDown * this.ySeparation;
        if (j == 1) {
          this.currentPerson = this.family.find(person => person.personID == startPerson.motherID);
        }
        else {
          this.currentPerson = this.family.find(person => person.personID == startPerson.fatherID);
        }
        this.PersonDisplay(this.currentPerson,this.xPosn,this.yPosn);
        if (i == 0 ) {
          this.Connect2(this.drawWidth/2, this.drawHeight/2 + 4, this.xPosn, this.yPosn, this.upDown)
        }
        else {
          this.Connect(this.drawWidth/2, this.drawHeight/2 + 4, this.xPosn, this.yPosn, this.upDown)
        }
        this.prevxPosn2 = this.xPosn;
        this.prevyPosn2 = this.yPosn;
        this.previousPerson2 = this.currentPerson;
        for (let k = this.count2; k < this.count2 + 3; k += 2) {
          this.xPosn = this.drawWidth * k /(this.scale * 2);
          this.yPosn = this.drawHeight/2 + this.upDown * 2 * this.ySeparation;
          if (this.previousPerson2) {
            if (k == this.count2) {
              this.currentPerson = this.family.find(person => person.personID == this.previousPerson2.motherID);
            }
            else {
              this.currentPerson = this.family.find(person => person.personID == this.previousPerson2.fatherID);
            }
          }
          if (this.currentPerson) {
            this.PersonDisplay(this.currentPerson,this.xPosn,this.yPosn);
            this.Connect(this.prevxPosn2, this.prevyPosn2 + this.upDown * 15, this.xPosn, this.yPosn, this.upDown)
          }
          this.prevxPosn3 = this.xPosn;
          this.prevyPosn3 = this.yPosn;
          this.previousPerson3 = this.currentPerson;
          for (let m = this.count3; m < this.count3 + 3; m += 2) {
            this.xPosn = this.drawWidth * m /(this.scale * 4);
            this.yPosn = this.drawHeight/2 + this.upDown * 3 * this.ySeparation;
            if (this.previousPerson3) {
              if (m == this.count3) {
                this.currentPerson = this.family.find(person => person.personID == this.previousPerson3.motherID);
              }
              else {
                this.currentPerson = this.family.find(person => person.personID == this.previousPerson3.fatherID);
              }
            }
            if (this.currentPerson) {
              this.PersonDisplay(this.currentPerson,this.xPosn,this.yPosn);
              this.Connect(this.prevxPosn3, this.prevyPosn3 + this.upDown * 15, this.xPosn, this.yPosn, this.upDown)
            }
            this.prevxPosn4 = this.xPosn;
            this.prevyPosn4 = this.yPosn;
            this.previousPerson4 = this.currentPerson;
            for (let p = this.count4; p < this.count4 + 3; p += 2) {
              this.xPosn = this.drawWidth * p /(this.scale * 8);
              this.yPosn = this.drawHeight/2 + this.upDown * 4 * this.ySeparation;
              if (this.previousPerson4) {
                if (p == this.count4) {
                  this.currentPerson = this.family.find(person => person.personID == this.previousPerson4.motherID);
                }
                else {
                  this.currentPerson = this.family.find(person => person.personID == this.previousPerson4.fatherID);
                }
              }
              if (this.currentPerson) {
                this.PersonDisplay(this.currentPerson,this.xPosn,this.yPosn);
                this.Connect(this.prevxPosn4, this.prevyPosn4 + this.upDown * 15, this.xPosn, this.yPosn, this.upDown)
              }
              this.prevxPosn5 = this.xPosn;
              this.prevyPosn5 = this.yPosn;
              this.previousPerson5 = this.currentPerson;
              for (let q = this.count5; q < this.count5 + 3; q += 2) {
                this.xPosn = this.drawWidth * q /(this.scale * 16);
                this.yPosn = this.drawHeight/2 + this.upDown * 5 * this.ySeparation;
                if (this.previousPerson5) {
                  if (q == this.count5) {
                    this.currentPerson = this.family.find(person => person.personID == this.previousPerson5.motherID);
                  }
                  else {
                    this.currentPerson = this.family.find(person => person.personID == this.previousPerson5.fatherID);
                  }
                }
                if (this.currentPerson) {
                  this.PersonDisplay(this.currentPerson,this.xPosn,this.yPosn);
                  this.Connect(this.prevxPosn5, this.prevyPosn5 + this.upDown * 15, this.xPosn, this.yPosn, this.upDown)
                }
              }
              this.count5 += 4;
            }
            this.count4 += 4;
          }
          this.count3 += 4;
        }
        this.count2 += 4;
      }
      this.upDown = 1;
      this.count2 = 1;
      this.count3 = 1;
      this.count4 = 1;
      this.count5 = 1;
      this.startPersonID = "JefferyEdwinWoodhams1950";
    }
  }
  private AddRoutingClick(xValue: number, yValue: number, routingService: RoutingService, personID: string) {
    var drawCanvas = this.ctx.canvas, elements = [];
    elements.push({
      width: 100,
      height: 50,
      top: yValue - 15,
      left: xValue -50,
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
  }
  private Connect2(x1: number, y1: number, x2: number, y2: number, upDown: number) {
    this.ctx.moveTo(x1, y1 + 8);
    this.ctx.lineTo(x1, y1 - this.line);
    this.ctx.lineTo(x2, y1 - this.line);
    this.ctx.lineTo(x2, y2 + this.line + 8);
    this.ctx.stroke();
  }
  private Connect(x1: number, y1: number, x2: number, y2: number, upDown: number) {
    this.ctx.strokeStyle = "Plum"
    if (upDown == 1) {
      this.ctx.moveTo(x1, y1 + 8);
      this.ctx.lineTo(x1, y1 + this.line);
      this.ctx.lineTo(x2, y1 + this.line);
      this.ctx.lineTo(x2, y2 - this.line);
    }
    else {
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x1, y1 - this.line);
      this.ctx.lineTo(x2, y1 - this.line);
      this.ctx.lineTo(x2, y2 + this.line + 4);
    }
    this.ctx.stroke();
  }

  private PersonDisplay(person: Person, xPosition: number, yPosition: number, ) {
    this.ctx.fillStyle = "DarkBlue";
    this.ctx.fillText(person.name.split(' ',1) +"", xPosition, yPosition);
    this.ctx.fillText(person.surname, xPosition, yPosition + this.line);
    this.AddRoutingClick(xPosition, yPosition, this.routingService, person.personID)
  }
}
