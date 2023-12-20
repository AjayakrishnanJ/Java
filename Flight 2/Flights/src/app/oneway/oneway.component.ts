import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AirlineService } from '../airline.service';

@Component({
  selector: 'app-oneway',
  templateUrl: './oneway.component.html',
  styleUrls: ['./oneway.component.css']
})
export class OnewayComponent implements OnInit {
  fromPlace: string = '';
  fromCode: string = '';
  toCode: string = '';
  toPlace: string = '';
  deDate:string='';
  TravelClass:string='';
  reDate:string='';
  flightRoutes: any[] = [];

  constructor(private route: ActivatedRoute,private as:AirlineService) { }

  ngOnInit(): void {
    // Subscribe to route parameters
  this.route.paramMap.subscribe((params) => {
    // Get the 'from' and 'to' values from route parameters
    this.fromPlace = params.get('fromPlace') || '';
    this.toPlace = params.get('toPlace') || '';
    this.fromCode = params.get('from') || '';
    this.toCode = params.get('to') || '';
    this.deDate = params.get('dDate') || '';
    this.TravelClass = params.get('TravelClass') || '';
    this.reDate = params.get('rDate') || '';

    const rawDate = new Date(this.deDate); // Assuming this.deDate is a valid date string

    const year = rawDate.getFullYear();
    const month = String(rawDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(rawDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;


    // Now you can use these values in your component
    const requestData = {
      class: [this.TravelClass], // Assuming TravelClass is an array, if not, adjust as needed
      routes: [
        {
          date: formattedDate,
          departure: this.fromCode,
          arrival: this.toCode
        }
      ]
    };

    // Send the data to the backend API using your service
    this.sendDataToBackend(requestData);

  });
}

sendDataToBackend(data: any) {
  // Assuming your service has a method for making POST requests to your API
  this.as.getAirlineRoutes(data).subscribe(
    (response) => {
      // Handle the response from the backend API if needed
      console.log('API Response:', response);

      this.flightRoutes = []; // Initialize the flightRoutes array

      if (Array.isArray(response)) {
        // Iterate through each route in the response
        response.forEach((route: any) => {
          if (Array.isArray(route.results)) {
            route.results.forEach((result: any) => {
              const airline = result.Airline || {};
              this.flightRoutes.push({
                airlineName: airline.name || 'N/A',
                airlineCode: result.airline_code || 'N/A',
                airlineLogo: airline.logo || 'N/A',
                isLowCost: airline.is_lowcost === 1,
                departureDate: route.date || 'N/A'
              });
            });
          }
        });
      } else {
        // Handle the case where the response is not an array
        console.error('API Response is not an array.');
      }

    },
    (error) => {
      // Handle errors if the request fails
      console.error('API Error:', error);
    }
  );
}

}
