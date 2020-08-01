import { Component, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import { Person, Event } from 'sdk';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalService } from '../_modal'
import { RoutingService } from '../../services/routing.service';
import { ThrowStmt, HtmlAstPath } from '@angular/compiler';
import { filter } from 'rxjs/operators';
import { element } from 'protractor';
import * as peopleData from '../../assets/People.json'

@Component({
  selector: 'family-chart',
  templateUrl: './family-chart.component.html',
  styleUrls: ['./family-chart.component.css']
})

export class FamilyChartComponent implements OnInit, OnDestroy{

  constructor(private route: ActivatedRoute,private modalService: ModalService, private routingService: RoutingService, private router: Router){
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      if (e instanceof NavigationEnd) {
        this.route.paramMap.subscribe(route => {
          this.keyID = route.get('personID')
      })
      this.family = (peopleData as any).default;
      if (this.family) {
        this.keyPerson = this.family.find(person => person.personID == this.keyID);
        this.keySpouse = this.family.find(person => person.personID == this.keyPerson.spouseID);
        this.keySpouse2 = this.family.find(person => person.personID == this.keyPerson.spouse2ID);
        this.keySpouse3 = this.family.find(person => person.personID == this.keyPerson.spouse3ID);
        if (this.keySpouse && this.keySpouse.spouse2ID && this.keySpouse.spouse2ID != this.keyPerson.personID) {
          this.keyPerson2 = this.family.find(person => person.personID == this.keySpouse.spouse2ID);
        }
        if (this.keySpouse && this.keySpouse.spouse3ID && this.keySpouse.spouse3ID != this.keyPerson.personID) {
          this.keyPerson3 = this.family.find(person => person.personID == this.keySpouse.spouse3ID);
        }
        this.SetIDs();
        this.childIndex = 7; this.childTextWidth = 25;
        this.xValues = [591, 1301, 759, 393, 1477, 1121, 905, 100, 293, 487, 680, 1230, 1430, 1630, 1830, 2030, 2230, 2430, 2630, 2830, 3030, 3230, 3430 ];
        this.yValues = [50, 50, 50, 50, 50, 50, 50 ];
        this.indexComplete = [false, false];
        this.children = this.family.filter(person => (person.fatherID == this.ids[0] && (person.motherID == this.ids[1] || person.motherID == this.ids[6] || person.motherID == this.ids[7])) 
        || ((person.motherID == this.ids[0] || person.motherID == this.ids[6] || person.motherID == this.ids[7]  )&& person.fatherID == this.ids[1])
        || (person.motherID == this.ids[0] && person.fatherID == this.ids[6]) 
        || (this.keyPerson2 && person.motherID == this.keyPerson2.personID && person.fatherID == this.ids[1])).sort(this.PersonDateSort);
        this.children1 = this.children.filter(child => (child.fatherID == this.ids[0] && child.motherID == this.ids[1]) 
        || (child.motherID == this.ids[0] && child.fatherID == this.ids[1])).sort(this.PersonDateSort);
        this.children2 = this.children.filter(child => (child.fatherID == this.ids[0] && child.motherID == this.ids[6]) || (child.motherID == this.ids[0] && child.fatherID == this.ids[6]) 
        || (child.motherID == this.ids[6] && child.fatherID == this.ids[1]) || (this.keyPerson2 && child.motherID == this.keyPerson2.personID && child.fatherID == this.ids[1])).sort(this.PersonDateSort);
        this.children3 = this.children.filter(child => (child.fatherID == this.ids[0] && child.motherID == this.ids[7]) || (child.motherID == this.ids[0] && child.fatherID == this.ids[7]) 
        || (child.motherID == this.ids[7] && child.fatherID == this.ids[1]) || (this.keyPerson3 && child.motherID == this.keyPerson3.personID && child.fatherID == this.ids[1])).sort(this.PersonDateSort);
        if (this.children.length < 3){
          this.xValues[7] = 500;
          this.xValues[8] = 1500;
          this.childWidth = 300
          this.childTextWidth = 40;
        }
        else if (this.children.length < 5){
          this.xValues[7] = 200;
          this.xValues[8] = 560;
          this.xValues[9] = 1320;
          this.xValues[10] = 1680;
          this.childWidth = 300;
          this.childTextWidth = 40;
        }
        else if (this.children.length < 7){
          this.xValues[7] = 130;
          this.xValues[8] = 380;
          this.xValues[9] = 630;
          this.xValues[10] = 1260;
          this.xValues[11] = 1510;
          this.xValues[12] = 1760;
          this.childWidth = 200;
          this.childTextWidth = 30;
        }
        this.keyMarriage = this.keyPerson.events.find(event => event.description == "Marriage");
        if (!this.keyMarriage && this.keySpouse) this.keyMarriage = this.keySpouse.events.find(event => event.description == "Marriage");
      }
      this.CanvasSetup();
      this.Parents();
      this.KeyPeople();
      this.KeySingleData();
      if (this.keyMarriage) {
        this.KeyPeopleMarriage();
        this.MarriedData();
      }
      }
    });
  }
//#region Variablea
  @ViewChild('canvas', { static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D; 
  private parentWidth: number = 175; private keyWidth: number = 350; private childWidth: number = 180;
  private line: number = 20; private keyID: string;
  private ids: string[] = ["keyID","spouseID",'motherID',"fatherID","spouseMotherID","spouseFatherID","spouse2ID","spouse3ID"]
  private xValues: number[] = [591, 1301, 759, 393, 1477, 1121, 905, 100, 300, 500, 700, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3130, 3330 ]
  private yValues: number[] = [50, 50, 50, 50, 50, 50, 50 ]
  private childIDs: string[] = []; private childIndex: number = 7; private childTextWidth: number = 25;
  private keyPerson: Person; private keySpouse: Person; private keySpouse2: Person; private keyPerson2: Person;private family: Person[];
  private keySpouse3: Person; private keyPerson3: Person;
  private children: Person[];  private children1: Person[];  private children2: Person[]; private children3: Person[]; 
  private eventTypes: string[] = ["Birth", "Christening", "Death", "Funeral", "Marriage", "Marriage2", "Marriage3"];
  private prefixes: string[] = ["Born", "Christened", "Died", "Buried", "Married", "Married", "Married"];
  private keyMarriage: Event; private indexComplete: boolean[] = [false, false]
  private navigationSubscription: any;
//#endregion

  ngOnInit(): void {
  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }
  private Parents() {
    var maxYValue = 0;
    for (let i = 2; i <=5; i++){
      var person = this.family.find(person => person.personID == this.ids[i]);
      if (person){
        this.PersonDisplay(person, i, this.parentWidth/2, "left");
        this.AddRoutingClick(this.xValues[i] - this.parentWidth/2, this.yValues[i], this.routingService, person.personID)
        for (let j = 0; j < 4; j++){
          var event = person.events.find(event => event.description == this.eventTypes[j]);
          if (event){
            this.MainEventsDisplay(j, event, this.parentWidth, i, "left", "", false, false);
            if (j == 0) j++;
          }
        }
        if (this.yValues[i] > maxYValue) maxYValue = this.yValues[i]
      }
    }
    maxYValue += 0.5 * this.line;
    for (let i = 2; i <=5; i++){
      this.yValues[i] = maxYValue + 2 * this.line;
    }
    this.ParentMarriages(maxYValue);                                    
  }
  private ParentMarriages(startYValue: number) {
    this.ctx.beginPath();
    for (let i = 2; i <= 4; i += 2){
      var person = this.family.find(person => person.personID == this.ids[i + 1]);
      if (person){
        this.ParentLinesDraw(startYValue, i);
        if ( person.spouseID == this.keyPerson.motherID || (this.keySpouse && person.spouseID == this.keySpouse.motherID)) {
          var marriage = person.events.find(event => event.description == "Marriage")
        }
        else if ( person.spouse2ID == this.keyPerson.motherID || (this.keySpouse2 && person.spouseID == this.keySpouse2.motherID)){
          marriage = person.events.find(event => event.description == "Marriage2")
        }
        else {
          marriage = person.events.find(event => event.description == "Marriage3")
        }
        if (marriage) {
          this.MainEventsDisplay(4, marriage, this.parentWidth, i/2 -1, "left", "", false, false)
        }
        this.LineSeparator( i/2 - 1, false)
      }
    }
    this.KeyPeopleBalance();
    this.ctx.stroke();
  }
  private KeyPeople(){ 
    for (let i = 0; i <= 1; i++){
      this.yValues[i] += this.line;
      var person = this.family.find(person => person.personID == this.ids[i])
      if (person){
        this.PersonDisplay(person, i, this.parentWidth/2, "left");
        this.AddRoutingClick(this.xValues[i] - this.parentWidth/2, this.yValues[i], this.routingService, person.personID)
      }
      this.yValues[i] += 0.5*this.line;
     }
  }
  private KeySingleData(){
    if (this.keyMarriage && this.keySpouse) {
      const marriageDate = new Date(this.keyMarriage.date);
      var keyEvents = this.keyPerson.events.filter(event => new Date(event.date) < marriageDate).sort(this.EventDateSort);
      var spouseEvents = this.keySpouse.events.filter(event => new Date(event.date) < marriageDate).sort(this.EventDateSort);
      var events = [keyEvents, spouseEvents];
      for (let i = 0; i <= 1; i++){
        events[i].forEach(event =>{
          if ( this.eventTypes.includes(event.description)){
            this.MainEventsDisplay(this.eventTypes.indexOf(event.description), event, this.parentWidth, i, "left", "", false, event.single)
          }
          else {
            this.EventDisplay(event, i, this.parentWidth, "left");
          }
          this.LineSeparator(i, false);
        })
      }
    }
    else {
      this.keyPerson.events.sort(this.EventDateSort).forEach(event =>{
        if ( this.eventTypes.includes(event.description)){
          this.MainEventsDisplay(this.eventTypes.indexOf(event.description), event, this.parentWidth, 0, "left", "", false, event.single)
        }
        else {
          this.EventDisplay(event, 0, this.parentWidth, "left");
        }
        this.LineSeparator(0, false);
      })
    }
  }
  private KeyPeopleMarriage() {  
    this.KeyPeopleConnect();
    this.MainEventsDisplay(4, this.keyMarriage, this.parentWidth, 0, "top", "", false, false);
    this.KeyPeopleBalance();
    this.LineSeparators(this.indexComplete);
  } 
  private MarriedData(){
    var events = this.PrepareEvents();
    events.forEach(event =>{
      var spouseIndex = 0;
      var prevYValues = [this.yValues[0],this.yValues[1]]
      if (event.description == "ChildStart"){
        this.ChildrenDisplay(event.images)
      }
      else if ( this.eventTypes.includes(event.description)){
        if (event.description == "Marriage2" || event.description == "Marriage3") {
          this.yValues[0] += 2 * this.line;
          this.yValues[1] += 2 * this.line;
          if (event.personID == this.keyPerson.personID && this.keySpouse2 && event.description == "Marriage2") {
            this.PersonDisplay(this.keySpouse2,1, 0, "top");
            this.AddRoutingClick(this.xValues[1], this.yValues[1], this.routingService, this.keySpouse2.personID)
          }
          else if (event.personID == this.keyPerson.personID && this.keySpouse3 && event.description == "Marriage3") {
            this.PersonDisplay(this.keySpouse3,1, 0, "top");
            this.AddRoutingClick(this.xValues[1], this.yValues[1], this.routingService, this.keySpouse3.personID)
          }
          else if (this.keyPerson2) {
            this.PersonDisplay(this.keyPerson2, 0, this.parentWidth, "top");
            this.AddRoutingClick(this.xValues[0] - this.parentWidth, this.yValues[0], this.routingService, this.keyPerson2.personID)
            this.yValues[0] += this.line;
          }
          else if (this.keyPerson3) {
            this.PersonDisplay(this.keyPerson3, 0, this.parentWidth, "top");
            this.AddRoutingClick(this.xValues[0] - this.parentWidth, this.yValues[0], this.routingService, this.keyPerson3.personID)
            this.yValues[0] += this.line;
          }
          this.MainEventsDisplay(this.eventTypes.indexOf(event.description), event, this.parentWidth, 0, "top", "", false, event.single)
          this.indexComplete[1] = false;
          spouseIndex = 1;
        }
        else if (this.keySpouse && event.personID == this.keySpouse.personID || (this.keySpouse2 && event.personID == this.keySpouse2.personID)
        || (this.keySpouse3 && event.personID == this.keySpouse3.personID)) {
          this.yValues[1] += this.line;
          this.MainEventsDisplay(this.eventTypes.indexOf(event.description), event, 0, 1, "top", "", false, event.single)
        }
        else  {
          this.yValues[0] += this.line;
          this.MainEventsDisplay(this.eventTypes.indexOf(event.description), event, this.parentWidth - 20, 0, "top", "", false, event.single)
          spouseIndex = 1;
        }
      }
      else{
        if (event.single == true) {
          if (event.personID == this.keySpouse.personID || (this.keySpouse2 && event.personID == this.keySpouse2.personID)) {
            this.yValues[1] += this.line;
            this.EventDisplay(event, 1, 0, "top");
          }
          else {
            this.yValues[0] += this.line;
            this.EventDisplay(event, 0, this.parentWidth - 20, "top");
            spouseIndex = 1;
          }
        }
        else {
          this.yValues[0] += this.line;
          this.EventDisplay(event, 0, this.parentWidth, "top");
        }
      }
    this.KeyPeopleBalance();
      this.VerticalLinks(events, event, spouseIndex, prevYValues);
    })
  }
  private ChildrenDisplay(children: Person[]){
      children.forEach(child=> {
        this.yValues[this.childIndex] = this.yValues[0];
        this.childIDs[this.childIndex] = child.personID;
        this.ChildConnect();
        this.PersonDisplay(child, this.childIndex, this.childWidth/2, "top");
        this.AddRoutingClick(this.xValues[this.childIndex] - this.childWidth/2, this.yValues[this.childIndex], this.routingService, child.personID)
        this.yValues[this.childIndex] += 0.5 * this.line;
        this.ChildLineSeparator();
        var {spouse, spouse2, spouse3, childEvents} = this.SpouseEvents(child);
        childEvents.sort(this.EventDateSort).forEach(event =>{
          if ( this.eventTypes.includes(event.description)){
            if (event.description == "Marriage") {
              this.yValues[this.childIndex] += 2 * this.line;
              if (spouse) this.PersonDisplay(spouse, this.childIndex, this.childWidth/2, "top");
              this.AddRoutingClick(this.xValues[this.childIndex] - this.childWidth/2, this.yValues[this.childIndex], this.routingService, spouse.personID)
              this.yValues[this.childIndex] += this.line;
            }
            if (event.description == "Marriage2") {
              this.yValues[this.childIndex] += 2 * this.line;
              if (spouse2) this.PersonDisplay(spouse2, this.childIndex, this.childWidth/2, "top");
              this.AddRoutingClick(this.xValues[this.childIndex] - this.childWidth/2, this.yValues[this.childIndex], this.routingService, spouse2.personID)
              this.yValues[this.childIndex] += this.line;
            }
            else if (event.description == "Marriage3") {
              this.yValues[this.childIndex] += 2 * this.line;
              if (spouse3) this.PersonDisplay(spouse3, this.childIndex, this.childWidth/2, "top");
              this.AddRoutingClick(this.xValues[this.childIndex] - this.childWidth/2, this.yValues[this.childIndex], this.routingService, spouse3.personID)
              this.yValues[this.childIndex] += this.line;
            }
            var eventData = this.DeathBurialEvent(event, child, spouse, spouse2, spouse3);
            this.MainEventsDisplay(this.eventTypes.indexOf(event.description), event, this.childWidth, this.childIndex, "top", eventData, true, event.single)
          }
          else {
            this.EventDisplay(event, this.childIndex, this.childWidth, "top", true);
          }
          if (child.events.indexOf(event) != child.events.length - 1) this.ChildLineSeparator();
        });
        this.childIndex++;
      });
  }
//#region Display Functions
private DeathBurialEvent(event: Event, child: Person, spouse: Person, spouse2: Person, spouse3: Person) {
  var eventData = "";
  if (event.description == "Death" && event.personID != child.personID) {
    if (spouse && event.personID == spouse.personID)
      eventData = spouse.name;
    else if (spouse2 && event.personID == spouse2.personID)
      eventData = spouse2.name;
    else if (spouse3 && event.personID == spouse3.personID)
      eventData = spouse3.name;
    eventData += " died " + event.dateString;
  }
  else if (event.description == "Funeral" && event.personID != child.personID) {
    if (spouse && event.personID == spouse.personID)
      eventData = spouse.name;
    else if (spouse2 && event.personID == spouse2.personID)
      eventData = spouse2.name;
    else if (spouse3 && event.personID == spouse3.personID)
      eventData = spouse3.name;
    eventData += " was buried " + event.dateString;
  }
  return eventData;
}
private EventDisplay(event: Event, personIndex: number, xOffset: number, imagePosition: string, child?: boolean) {
    var textWidth;
    ({ textWidth, xOffset } = this.EventSetup(event, personIndex, xOffset, child, event.single));
    var { prefix, suffix, description } = this.EventStringPreparation(event);
    let eventString = `${ event.dateString}: ${description}${event.occupation} ${prefix}${event.location}${suffix}${event.place}`
    var noLines = this.WrapString(eventString, textWidth, this.xValues[personIndex] - xOffset, this.yValues[personIndex]);
    this.yValues[personIndex] += this.line;
    if (event.images){
      this.ImagesDisplay(event.images, personIndex, xOffset, imagePosition);
    }
    this.yValues[personIndex] += (noLines - 0.5) * this.line;
  }
  private EventSetup(event: Event, personIndex: number, xOffset: number, child: boolean, single: boolean) {
    if (single == true && !child) {
      var textWidth = 25;
      if (personIndex == 1) xOffset = 0;
    }
    else {
      textWidth = 40;
      xOffset = xOffset / 2;
    }
    if (child)
      textWidth = this.childTextWidth;
    return { textWidth, xOffset };
  }
  private EventStringPreparation(event: Event) {
    var prefix = "";
    var suffix = " in ";
    var description = event.description;
    if (event.location == "") {
      suffix = "";
    }
    if (event.description == "Census") {
      event.dateString = new Date(event.date).getFullYear() + " Census";
      description = "";
      if (event.occupation == null) event.occupation = "";
      prefix = "living at ";
      if (event.location == "") {
        prefix = "living in ";
      }
    }
    return { prefix, suffix, description };
  }
  private ImagesDisplay(images: any[], personIndex: number, xOffset: number, imagePosition: string) {
    for (let j = 0; j < images.length; j++) {
      if (imagePosition == "left"){
        var xPosition = -(xOffset + (j +1) * 30);
        var yPosition = 0;
      }
      else {
        var xPosition = j * 30 - xOffset + 5;
        var yPosition = -18;
      }
      this.AddImageLink(personIndex, xPosition, yPosition, images[j].image, images[j].type);
    }
  }
  private MainEventsDisplay( j: number, event: Event, xOffset: number, personIndex: number, imagePosition: string, eventData: string, child: boolean, single: boolean) {
    var textWidth;
    ({ textWidth, xOffset } = this.EventSetup(event, personIndex, xOffset, child, single));
    if (eventData == "") eventData = this.prefixes[j] + ": " + event.dateString;
    if (event.location) {
      eventData += " at " + event.location;
    }
    if (event.place) {
      eventData += " in " + event.place;
    }
    let noLines = this.WrapString(eventData, textWidth, this.xValues[personIndex] - xOffset, this.yValues[personIndex]);
    this.yValues[personIndex] += this.line;
    if (event.images) {
      this.ImagesDisplay(event.images, personIndex, xOffset, imagePosition) 
    }
    this.yValues[personIndex] += (noLines - 0.5) * this.line;
  }
  private PersonDisplay(person: Person, personIndex: number, xOffset: number, imagePosition: string) {
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(person.name + " " + person.surname, this.xValues[personIndex] - xOffset, this.yValues[personIndex]);
    if (person.personalImage) {
      this.ImagesDisplay(person.personalImage, personIndex, xOffset, imagePosition);
    }
    this.ctx.font = "15px Arial";
  }
  private PrepareEvents() {
    var events: Event[] = this.keyPerson.events.filter(event => new Date(event.date) > new Date(this.keyMarriage.date)).slice();
    var children: Person[] = this.children1;
    for (let i = 0; i <= 2; i++) {
      if (children.length > 0 && children[0].events.find(event => event.description == "Birth" || event.description == "Christening")) {
        var birthDate: Date = children[0].events.find(event => event.description == "Birth" || event.description == "Christening").date;
        var childStart = new Event();
        childStart.description = "ChildStart";
        childStart.date = birthDate;
        childStart.images = children;
        events.push(childStart);
      }
      if (i == 0) children = this.children2;
      else children = this.children3;
    }
    if (this.keyPerson.events.find(event => event.description == "Death" || event.description == "Funeral")) {
      let keyDeathDate = new Date(this.keyPerson.events.find(event => event.description == "Death" || event.description == "Funeral").date)
      if (this.keySpouse) {
        events.push.apply(events, this.keySpouse.events.filter(event => new Date(event.date) > keyDeathDate && (event.single == true || event.description == "Marriage2")));
        events.push.apply(events, this.keySpouse.events.filter(event => event.single == true && new Date(event.date) < keyDeathDate && new Date(event.date) > new Date(this.keyMarriage.date)));
      }
      else if (this.keyPerson2) {
        events.push.apply(events, this.keyPerson2.events.filter(event => new Date(event.date) > keyDeathDate && event.description != "Marriage" && event.description != "Marriage2"));
      }
      else if (this.keyPerson3) {
        events.push.apply(events, this.keyPerson2.events.filter(event => new Date(event.date) > keyDeathDate && event.description != "Marriage" && event.description != "Marriage3"));
      }
    }
    if (this.keySpouse.events.find(event => event.description == "Death" || event.description == "Funeral")) {
      let spouseDeathDate = new Date(this.keySpouse.events.find(event => event.description == "Death" || event.description == "Funeral").date)
      if (this.keySpouse2) {
        events.push.apply(events, this.keySpouse2.events.filter(event => new Date(event.date) > spouseDeathDate && event.single == true));
      }
      if (this.keySpouse3) {
        events.push.apply(events, this.keySpouse3.events.filter(event => new Date(event.date) > spouseDeathDate && event.single == true));
      }
    }
    events.sort(this.EventDateSort);
    return events;
  }
  private SpouseEvents(child: Person) {
    var childEvents = child.events.slice();
    var spouse = this.family.find(person => person.personID == child.spouseID);
    if (spouse) {
      if (!child.events.find(event => event.description == "Marriage")) {
        var marriage = spouse.events.find(event => event.description == "Marriage");
        if (marriage) child.events.push(marriage);
      }
      var spouseDeath = spouse.events.find(event => event.description == "Death" || event.description == "Funeral");
      if (spouseDeath) childEvents.push(spouseDeath); 
    }
    var spouse2 = this.family.find(person => person.personID == child.spouse2ID);
    if (spouse2) {
      var spouse2Death = spouse2.events.find(event => event.description == "Death" || event.description == "Funeral");
      if (spouse2Death) child.events.push(spouse2Death);
    }
    var spouse3 = this.family.find(person => person.personID == child.spouse3ID);
    if (spouse3) {
      var spouse3Death = spouse3.events.find(event => event.description == "Death" || event.description == "Funeral");
      if (spouse3Death) child.events.push(spouse3Death);
    }
    return { spouse, spouse2, spouse3, childEvents};
  }
//#endregion

//#region support
  private AddImageLink(personIndex: number, xOffset: number, yOffset, personImage: string, iconType: string) {    
    this.AddIcon(this.xValues[personIndex] + xOffset, this.yValues[personIndex] + yOffset - 18, iconType);
    this.AddModalClick(this.xValues[personIndex] + xOffset, this.yValues[personIndex] + yOffset, this.modalService, personImage);
  }
  private AddIcon(xValue: number, yValue: number, iconType: string) {
    var img = new Image();
    img.src = "./assets/" + iconType + ".jpg";
    img.onload = () => {
      this.ctx.drawImage(img, xValue, yValue,27,20);
    };
  }
  private AddModalClick(xValue: number, yValue: number, modalService: ModalService, imageRecord: string) {
    var drawCanvas = this.ctx.canvas, elements = [];
    elements.push({
      width: 20,
      height: 20,
      top: yValue,
      left: xValue,
      imageSource: imageRecord
    });
    drawCanvas.addEventListener('click', function (event) {
      var xVal = event.pageX, yVal = event.pageY;
      for (let ele of elements){
        if (yVal > ele.top && yVal < ele.top + ele.height && xVal > ele.left && xVal < ele.left + ele.width) {
          modalService.open(ele.imageSource);
          break
        }
      }
    }, false);
  }
  private AddRoutingClick(xValue: number, yValue: number, routingService: RoutingService, personID: string) {
    var drawCanvas = this.ctx.canvas, elements = [];
    elements.push({
      width: 200,
      height: 20,
      top: yValue,
      left: xValue,
      person: personID
    });
    drawCanvas.addEventListener('click', function (event) {
      var xVal = event.pageX, yVal = event.pageY;
      for (let ele of elements){
        if (yVal > ele.top && yVal < ele.top + ele.height && xVal > ele.left && xVal < ele.left + ele.width) {
          routingService.openChart(ele.person);
          break
        }
      }
    }, false);
  }
  private CanvasSetup() {
    this.ctx.fillStyle = "Linen";
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.font = "13px Arial";
    this.ctx.fillStyle = "Purple";
    this.ctx.strokeStyle = "Purple";
    this.ctx.fillText("Clicking on a person's name will", 20, 230);
    this.ctx.fillText("re-focus the chart on that person", 20, 245);
    this.ctx.fillText("Clicking on an icon will", 20, 265);
    this.ctx.fillText("display the image for that event", 20, 280);
    this.ctx.moveTo(12, 213);
    this.ctx.lineTo(217, 213);
    this.ctx.lineTo(217, 290);
    this.ctx.lineTo(12, 290);
    this.ctx.lineTo(12, 213);
    this.ctx.stroke();
    this.ctx.font = "15px Arial";
    this.ctx.fillStyle = "DarkBlue";
    this.ctx.strokeStyle = "Plum";
  }
  private ChildConnect() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.xValues[this.childIndex], this.yValues[this.childIndex] + 1.5 * this.line);
    this.ctx.lineTo(this.xValues[this.childIndex], this.yValues[this.childIndex]);
    this.ctx.lineTo(this.xValues[0], this.yValues[this.childIndex]);
    this.ctx.stroke();
    this.yValues[this.childIndex] += 2.5 * this.line;
  }
  private ChildLineSeparator() {
    this.ctx.moveTo(this.xValues[this.childIndex], this.yValues[this.childIndex]);
    this.yValues[this.childIndex] += this.line;
    this.ctx.lineTo(this.xValues[this.childIndex], this.yValues[this.childIndex]);
    this.ctx.stroke();
  } 
  closeModal(id: string) {
    this.modalService.close(id);
  }
  private EventDateSort(a : Event, b : Event) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
  
    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  } 
  private KeyPeopleBalance() {
    if (this.yValues[0] > this.yValues[1]) {
      this.yValues[1] = this.yValues[0];
    }
    if (this.yValues[1] > this.yValues[0]) {
      this.yValues[0] = this.yValues[1];
    }
  }
  private KeyPeopleConnect() {
    let maxYValue = this.yValues[0];
    if (this.yValues[1] > maxYValue)
      maxYValue = this.yValues[1];
    this.ctx.beginPath();
    this.ctx.moveTo(this.xValues[0], this.yValues[0]);
    this.ctx.lineTo(this.xValues[0], maxYValue + this.line);
    this.ctx.lineTo(this.xValues[1], maxYValue + this.line);
    this.ctx.lineTo(this.xValues[1], this.yValues[1]);
    this.yValues[0] = maxYValue + this.line;
    this.yValues[1] = maxYValue + this.line;
    this.xValues[0] = this.xValues[0] + this.keyWidth - 10;
    this.xValues[1] = this.xValues[1] - this.keyWidth + 10;
    this.ctx.moveTo(this.xValues[0], this.yValues[0]);
    this.yValues[0] += this.line;
    this.ctx.lineTo(this.xValues[0], this.yValues[0]);
    this.ctx.moveTo(this.xValues[1], this.yValues[1]);
    this.yValues[1] += this.line;
    this.ctx.lineTo(this.xValues[1], this.yValues[1]);
    this.ctx.stroke();
  }
  private LineSeparators(indexComplete: boolean[]) {
    if (!indexComplete[0]) this.LineSeparator(0, true);
    if (!indexComplete[1]) this.LineSeparator(1, true);
  }
  private LineSeparator(personIndex: number, married: boolean) {
    this.ctx.moveTo(this.xValues[personIndex], this.yValues[personIndex]);
    this.yValues[personIndex] += this.line;
    if (married) this.ctx.lineTo(this.xValues[personIndex], this.yValues[personIndex] + this.line);
    else this.ctx.lineTo(this.xValues[personIndex], this.yValues[personIndex]);
    this.ctx.stroke();
  }
  private ParentLinesDraw(startYValue: number, i: number) {
    let yValue = startYValue;
    this.ctx.moveTo(this.xValues[i], yValue);
    yValue += 0.5 * this.line;
    this.ctx.lineTo(this.xValues[i], yValue);
    this.ctx.lineTo(this.xValues[i + 1], yValue);
    yValue -= 0.5 * this.line;
    this.ctx.lineTo(this.xValues[i + 1], yValue);
    yValue += 0.5 * this.line;
    this.ctx.moveTo(this.xValues[i/2 -1] , yValue);
    yValue += this.line;
    this.ctx.lineTo(this.xValues[i/2 - 1], yValue);
    this.yValues[i / 2 - 1] = yValue;
  }
  private PersonDateSort(a : Person, b : Person) {
    const dateA = a.birthYear;
    const dateB = b.birthYear;
  
    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }
  private SetIDs() {
      this.ids[0]= this.keyPerson.personID;
      this.ids[1]= this.keyPerson.spouseID;
      this.ids[2]= this.keyPerson.motherID;
      this.ids[3] = this.keyPerson.fatherID;
      if (this.keySpouse) {
        this.ids[4] = this.keySpouse.motherID;
        this.ids[5] = this.keySpouse.fatherID;
      }
      this.ids[6] = this.keyPerson.spouse2ID;
      this.ids[7] = this.keyPerson.spouse3ID;
  }
  private VerticalLinks(events: Event[], event: Event, spouseIndex: number, prevYValues: number[]) {
    let keyIndex = 0;
    let latestIndex = events.indexOf(event);
    var remainingEvents = [];
    if (spouseIndex == 1) {
        remainingEvents = events.filter(event => events.indexOf(event) > latestIndex && (event.personID == this.ids[1] || event.personID == this.ids[6]));
    }
    else {
      remainingEvents = events.filter(event => events.indexOf(event) > latestIndex && (event.personID == this.ids[0] || (this.keyPerson2 && event.personID == this.keyPerson2.personID)));
    }
    if (event.single) {
      if (spouseIndex == 0)
        keyIndex = 1;
      if (remainingEvents.length > 0) {
        this.ctx.moveTo(this.xValues[spouseIndex], prevYValues[keyIndex]);
        this.ctx.lineTo(this.xValues[spouseIndex], this.yValues[keyIndex]);
      }
    }
    if (event.personID == this.ids[0]) remainingEvents = events.filter(event => events.indexOf(event) > latestIndex 
                                                                      && (event.personID == this.ids[0] || (this.keyPerson2 && event.personID == this.keyPerson2.personID)));
    else if (this.keyPerson2 && event.personID == this.keyPerson2.personID) remainingEvents  = events.filter(event => events.indexOf(event) > latestIndex 
                                                                      && event.personID == this.keyPerson2.personID);
    else if (this.keyPerson3 && event.personID == this.keyPerson3.personID) remainingEvents  = events.filter(event => events.indexOf(event) > latestIndex 
                                                                      && event.personID == this.keyPerson3.personID);
    else if (event.personID == this.ids[1]) remainingEvents  = events.filter(event => events.indexOf(event) > latestIndex
                             && (event.personID == this.ids[1] || (this.keySpouse2 && event.personID == this.keySpouse2.personID)|| (this.keySpouse3 && event.personID == this.keySpouse3.personID)));
    else if (this.keySpouse2 && event.personID == this.keySpouse2.personID) remainingEvents  = events.filter(event => events.indexOf(event) > latestIndex
                                                                      && event.personID == this.keySpouse2.personID);
    else if (this.keySpouse3 && event.personID == this.keySpouse3.personID) remainingEvents  = events.filter(event => events.indexOf(event) > latestIndex
                                                                      && event.personID == this.keySpouse3.personID);
    if (remainingEvents.length == 0)
      this.indexComplete[keyIndex] = true;
    if (latestIndex != events.length - 1)
      this.LineSeparators(this.indexComplete);
  }
  private WordWrap(str, width, delimiter) {
    if (str.length>width) {
      var p=width
      for (; p > 0 && str[p] != ' '; p--) {
      }
      if (p > 0) {
        var left = str.substring(0, p);
        var right = str.substring(p + 1);
        return left + delimiter + this.WordWrap(right, width, delimiter);
      }
    }
    return str;
  }
  private WrapString(dataString: string, maxWidth: number, xValue: number, yValue: number) {
    let dataBlock = this.WordWrap(dataString, maxWidth, "|").split("|");
    var noLines: number;
    for (let i = 0; i < dataBlock.length; i++) {
      this.ctx.fillText(dataBlock[i], xValue, yValue + (i + 1) * this.line);
      noLines = i + 1;
    }
    return noLines
  }
  //#endregion support
}
