import React, { Component } from 'react';
import './App.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {FlightJson} from './FlightJson' //json for flight data
/** setup localizer for react-widget DateTimePicker**/
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
Moment.locale('en')
momentLocalizer()


export default class FlightSearch extends Component {

  constructor(props) {

    super(props);
    this.state = {
      isReturn: false,
      originCity: '',
      destinationCity: '',
      departureDate: null,
      returnDate: null,
      departureAvailable: '',
      returnAvailable: '',
      displayDepartDate: '',
      displayReturnDate: '',
      isFlightSearch: false,
      availableOrigin: '',
      availableDestination: '',
      availableFlight: [],
      returnAvailableFlight: [],
      returnStatus: '',
      priceRangeValue: 16000,
      errorMesssage: ''
    }
  }
  componentDidMount() {
  }

  istDateTostring(dateObj) {
    let date = dateObj ? dateObj.toLocaleDateString() : "";
    return date
  }

  handleOneWay() {
    this.setState({
      isReturn: false,
      returnAvailable: '',
      returnDate: null,
      returnAvailableFlight: [],
      returnStatus: '',
      errorMesssage: '',
      displayReturnDate: ''
    })
  }
  handleReturn() {
    this.setState({isReturn: true})
  }

  handleFieldChange(e) {
    if (e.target.id === 'o-city') {
      this.setState({originCity: e.target.value})
    }
    if (e.target.id === 'd-city') {
      this.setState({destinationCity: e.target.value})
    }
    this.setState({errorMesssage: ''})
  }
  returnDateBlock() {
    return (
      <div className="display-flex">
        <DateTimePicker
          format="DD/MM/YY"
          placeholder="Return Date"
          value={this.state.returnDate}
          onChange={returnDate => this.setState({
            returnDate: returnDate,
            returnAvailable: this.istDateTostring(returnDate),
            returnStatus: '',
            errorMesssage: ''}
          )}
          min={this.state.departureDate || new Date()}
          time={false}
          />
        {this.state.errorMesssage && this.state.returnAvailable==="" ? <span className="color-red">*</span> : ""}
        </div>
    )
  }
  getAvailableFlights = (orig, dest, date, range=16000) => {
    if (range===0) {
      return FlightJson.filter((flight) =>
        flight.origin.toLowerCase().indexOf(orig.toLowerCase()) > -1 &&
        flight.destination.toLowerCase().indexOf(dest.toLowerCase()) > -1 &&
        flight.date.indexOf(date) > -1
      );
    } else {
      return FlightJson.filter((flight) =>
        flight.origin.toLowerCase().indexOf(orig.toLowerCase()) > -1 &&
        flight.destination.toLowerCase().indexOf(dest.toLowerCase()) > -1 &&
        flight.date.indexOf(date) > -1 &&
        flight.price <= range
      );
    }

  }
  handleForm(e) {
    e.preventDefault();
  }
  searchFlight() {
    let orig = this.state.originCity
    let dest = this.state.destinationCity
    let departDate = this.state.departureAvailable
    let returnDate = this.state.returnAvailable
    if (orig.length < 3 || dest.length < 3) {
      this.setState({
        errorMesssage: "*enter atleast three characters in city"
      });
    }
    else if (departDate === '') {
      this.setState({errorMesssage: "*select departure date"});
    }
    else if (this.state.isReturn && returnDate==='') {
      this.setState({errorMesssage: "*select return date"});
    }
    else {
      let availableFlight = this.getAvailableFlights(orig, dest, departDate, this.state.priceRangeValue);
      let returnAvailableFlight = [];
      let status = '';
      if (this.state.isReturn && returnDate !== '') {
        returnAvailableFlight = this.getAvailableFlights(dest, orig, returnDate, this.state.priceRangeValue);
        status = returnAvailableFlight.length ? '' : 'noflight';
      }
      this.setState({
        isFlightSearch: true,
        availableOrigin: availableFlight.length ? availableFlight[0].origin : orig,
        availableDestination: availableFlight.length ? availableFlight[0].destination : dest,
        availableFlight: availableFlight,
        returnAvailableFlight: returnAvailableFlight,
        returnStatus: status,
        displayDepartDate: departDate,
        displayReturnDate: returnDate,
      })
    }
  }
  handleSubmitForm(e) {
    e.preventDefault();
    this.searchFlight();
  }
  handlePriceRange(e) {
    this.setState({priceRangeValue: e.target.value});
    if (this.state.isFlightSearch) {
      this.searchFlight();
    }
  }
  handleFlightBooking() {
    alert("your flight is confirmed, Thank you!");
  }

  render() {
    var handleDateChange = (dateVal) => {
        let toDate = this.istDateTostring(dateVal);
        this.setState({
        departureDate: dateVal,
        departureAvailable: toDate,
        errorMesssage: ''
      })
    }
    let $returnAvailableBox = (
      <div className="result-heading-box">
        <h3 className="result-heading">
          {this.state.availableOrigin+" > "}
          {this.state.availableDestination}
          {this.state.isFlightSearch && this.state.displayReturnDate ==='' ? ""
            : " > "+this.state.availableOrigin}
        </h3>
        <div className="depart-in-heading-box">
          <div>Depart: {this.state.displayDepartDate}</div>
          {this.state.isFlightSearch && this.state.displayReturnDate ==='' ? ""
            : <div>Return: {this.state.displayReturnDate}</div>}
        </div>
      </div>
    )
    let flightList = this.state.availableFlight.map((item, index) => {
      return <div key={index} className="">
        <h3>{"Rs. "+item.price}</h3>
        <div className="flight-name"><span>{item.fname}</span></div>
        <div><span>{item.ocode}</span><span> > </span><span>{item.dcode}</span></div>
        <div>Depart: <span>{item.depart}</span></div>
        <div>Arrive: <span>{item.arrive}</span></div>
      </div>
    })
    var bookingBlock = () => {
      return (
        <div className="form-group booking-width">
          <div className="booking-box"></div>
          <div className="col-sm-12 booking-flight-button">
            <button type="submit" value="Submit" className="btn btn-default form-control"
              onClick={(e)=>this.handleFlightBooking(e)}>
              Book this flight
            </button>
          </div>
        </div>
      )
    }

    let totalFlight = []
    this.state.availableFlight.forEach((itemone, index) => {
        let returnAvailable = this.state.returnAvailableFlight
        if (returnAvailable.length) {
          returnAvailable.forEach((itemreturn, index) => {
            let flight = Object.assign({},{onewayFlight: itemone, returnFlight: itemreturn})
            totalFlight.push(flight);
          })
        } else {
          let flight = Object.assign({},{onewayFlight: itemone, returnFlight: {}})
          totalFlight.push(flight);
        }
    })

    let displayReturnFlightResult = totalFlight.map((flight, index) => {
      let onewayFlight = flight.onewayFlight;
      let returnFlight = flight.returnFlight;
      return(
        <div key={index} className="flight-details-box">
          <div className="item-width">
            <h3>{"Rs. "+onewayFlight.price}</h3>
            <div className="flight-name"><span>{onewayFlight.fname}</span></div>
            <div><span>{onewayFlight.ocode}</span><span> > </span><span>{onewayFlight.dcode}</span></div>
            <div>Depart: <span>{onewayFlight.depart}</span></div>
            <div>Arrive: <span>{onewayFlight.arrive}</span></div>
          </div>
          {Object.keys(returnFlight).length ?
            <div className="item-width">
              <h3>{"Rs. "+returnFlight.price}</h3>
              <div className="flight-name"><span>{returnFlight.fname}</span></div>
              <div><span>{returnFlight.ocode}</span><span> > </span><span>{returnFlight.dcode}</span></div>
              <div>Depart: <span>{returnFlight.depart}</span></div>
              <div>Arrive: <span>{returnFlight.arrive}</span></div>
            </div>
            : this.state.returnStatus==='noflight' ? <div className="item-width">No flight on this date</div> : ""
          }
          {this.state.isFlightSearch ? bookingBlock() : ""}
        </div>
      )
    })

    return (
      <div className="container">
        <div className="row search-engine">
          <div className="col-md-2 col-sm-1 col-xs-1"></div>
          <div className="col-md-8 col-sm-10 col-xs-10 main-section">
            <div className="top-heading"><h2>Flight Search Engine</h2></div>
            <div className="col-md-4 col-sm-4 col-xs-4">
              <div className="flex-display left-section">
                <div className="one-way" onClick={(e) => this.handleOneWay()}>
                  One way
                </div>
                <div className="return" onClick={(e) => this.handleReturn()}>
                  Return
                </div>
              </div>
              <div className="search-form">
                <form className="form-horizontal" onSubmit={(e)=>this.handleForm(e)}>
                  <div className="form-group">
                    <div className="col-sm-12 display-flex">
                      <input type="text" required className="form-control" name="oCity" id="o-city"
                        value={this.state.originCity}
                        onChange={(e) => this.handleFieldChange(e)} placeholder="Enter Origin City" />
                      {this.state.errorMesssage && this.state.originCity.length<3 ? <span className="color-red">*</span> : ""}
                    </div>
                    <div className="col-sm-12 display-flex">
                      <input type="text" required className="form-control" name="dCity" id="d-city"
                        value={this.state.destinationCity}
                        onChange={(e) => this.handleFieldChange(e)} placeholder="Enter Destination City" />
                      {this.state.errorMesssage && this.state.destinationCity.length<3 ? <span className="color-red">*</span> : ""}
                    </div>
                  </div>
                  <div className="display-flex">
                    <DateTimePicker
                      format="DD/MM/YY"
                      placeholder="Departure date"
                      value={this.state.departureDate}
                      onChange={handleDateChange.bind(null)}
                      min={new Date()}
                      time={false}
                    />
                    {this.state.errorMesssage && this.state.departureAvailable==="" ? <span className="color-red">*</span> : ""}
                  </div>
                  {this.state.isReturn ? this.returnDateBlock() : ""}
                  <div className="form-group">
                    <div className="col-sm-12 search-button">
                      <button type="submit" value="Submit" className="btn btn-default form-control"
                        onClick={(e)=>this.handleSubmitForm(e)}>
                        Search
                      </button>
                    </div>
                  </div>
                  {this.state.errorMesssage ?
                    <div className="color-red">{this.state.errorMesssage}</div> : ""}
                </form>
              </div>
              <div className="refine-flight-search">
                <h4>Refine flight search</h4>
                <div>
                  <div className="min-range">0</div>
                  <div className="max-range">16000</div>
                </div>
                <input type="range" min="0" max="16000" className="cursor-pointer"
                  value={this.state.priceRangeValue}
                  onChange={(e)=>this.handlePriceRange(e)}/>
                <div className="text-center">{this.state.priceRangeValue}</div>
              </div>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <div className="right-section">
                {this.state.isFlightSearch ? $returnAvailableBox : <div className="to-search">to search a flight enter all the flight details</div>}
                <div>
                  {this.state.isFlightSearch && flightList.length <=0 ?
                    <div className="no-flight-available">Sorry! no flight available right now</div>
                    : <div>
                      {displayReturnFlightResult}
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-1 col-xs-1"></div>
        </div>
      </div>
    );
  }
}
