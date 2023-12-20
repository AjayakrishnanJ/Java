
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AirlineService } from '../airline.service';

@Component({
  selector: 'app-roundtrip',
  templateUrl: './roundtrip.component.html',
  styleUrls: ['./roundtrip.component.css']
})
export class RoundtripComponent implements OnInit {
  fromPlace: string = '';
  fromCode: string = '';
  toCode: string = '';
  toPlace: string = '';
  deDate:string='';
  TravelClass:string='';
  reDate:string='';
  flightRoutes: any[] = [];
  outboundFlightRoutes: any[] = [];
  inboundFlightRoutes: any[] = [];

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

    const rawDate1 = new Date(this.reDate); // Assuming this.deDate is a valid date string
    const year1 = rawDate1.getFullYear();
    const month1 = String(rawDate1.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day1 = String(rawDate1.getDate()).padStart(2, '0');
    const formattedDate1 = `${year1}-${month1}-${day1}`;

    // Now you can use these values in your component
    const requestData = {
      class: [this.TravelClass], // Assuming TravelClass is an array, if not, adjust as needed
      routes: [
        {
          date: formattedDate,
          departure: this.fromCode,
          arrival: this.toCode
        },
        {
          date: formattedDate1,
          departure: this.toCode,
          arrival: this.fromCode
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
      this.outboundFlightRoutes = []; // Initialize the outboundFlightRoutes array
      this.inboundFlightRoutes = []; // Initialize the inboundFlightRoutes array

      if (Array.isArray(response)) {
        // Iterate through each route in the response
        response.forEach((route: any, index: number) => {
          if (Array.isArray(route.results)) {
            route.results.forEach((result: any) => {
              const airline = result.Airline || {};
              const flightInfo = {
                airlineName: airline.name || 'N/A',
                airlineCode: result.airline_code || 'N/A',
                airlineLogo: airline.logo || 'N/A',
                isLowCost: airline.is_lowcost === 1,
                departureDate: route.date || 'N/A'
              };

              // Determine if it's an outbound or inbound flight based on the index
              if (index === 0) {
                this.outboundFlightRoutes.push(flightInfo);
              } else if (index === 1) {
                this.inboundFlightRoutes.push(flightInfo);
              }
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