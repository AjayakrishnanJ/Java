import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AirlineService } from '../airline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFlightType: string = 'roundtrip';
  multiCityFlights: any[] = [];
  routesForm:any;
  flyingFromInput: string = '';
  flyingFromCode:string='';         
  flyingToInput: string = '';
  flyingToCode:string='';
  departingDate: string = '';
  travelClass: string = 'Economy class';
  returningDate: string = '';
  flyingFromSuggestions: any[] = [];
  flyingToSuggestions: any[] = [];

  constructor(private router: Router,private fb:FormBuilder,private as:AirlineService) { 
    this.routesForm=this.fb.group({
      "from":[],
      "to":[],
      "ddate":[],
      "rdate":[],
      "class":[]
    })
  }

  ngOnInit(): void {
  }

  onFlightTypeChange(type: string) {
    this.selectedFlightType = type;
    if (type === 'multi-city') {
      this.multiCityFlights = [{ from: '', to: '' }];
    } else {
      this.multiCityFlights = [];
    }
  }

  addFlight() {
    this.multiCityFlights.push({ from: '', to: '' });
  }

  removeFlight(index: number) {
    if (index >= 0 && index < this.multiCityFlights.length) {
      this.multiCityFlights.splice(index, 1);
    }
  }
  showFlights() {
    let routeTo: string;
    const fromPlace=this.flyingFromInput
    const from = this.flyingFromCode;
    const toPlace=this.flyingToInput;
    const to = this.flyingToCode;
    const dDate = this.departingDate;
    const TravelClass = this.travelClass;
    const rDate = this.returningDate;
  
    switch (this.selectedFlightType) {
      case 'one-way':
        routeTo = '/oneway';
        break;
      case 'roundtrip':
        routeTo = '/roundtrip';
        break;
  
      default:
        routeTo='/home';
        break;
    }
  
    if (routeTo) {
      this.router.navigate([routeTo, { fromPlace,from,toPlace, to ,dDate,TravelClass,rDate}]);
    } else {
      // Handle validation or default case
    }
  }

  autocompleteAirports(keyword: string, inputField: string) {
    if (keyword.length >= 3) {
      console.log(`Autocompleting airports for ${inputField}: ${keyword}`);
      this.as.autocompleteAirports(keyword).subscribe(
        (response) => {
          console.log(`Received autocomplete response for ${inputField}:`, response);
          if (inputField === 'flyingFrom') {
            this.flyingFromSuggestions = response.matching_airports;
          } else if (inputField === 'flyingTo') {
            this.flyingToSuggestions = response.matching_airports;
          }
        },
        (error) => {
          console.error('Autocomplete error:', error);
        }
      );
    } else {
      // Clear suggestions if input is less than 3 characters
      if (inputField === 'flyingFrom') {
        this.flyingFromSuggestions = [];
      } else if (inputField === 'flyingTo') {
        this.flyingToSuggestions = [];
      }
    }
  }

  selectAirport(airport: any, inputField: string) {
    console.log(`Selected airport for ${inputField}:`, airport);
    // Set the selected airport in the input field
    if (inputField === 'flyingFrom') {
      this.flyingFromInput = airport.name;
      this.flyingFromCode=airport.code;
      this.flyingFromSuggestions = [];
    } else if (inputField === 'flyingTo') {
      this.flyingToInput = airport.name;
      this.flyingToCode=airport.code;
      this.flyingToSuggestions = [];
    }
  }
  

}
