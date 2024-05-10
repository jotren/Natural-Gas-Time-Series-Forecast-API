# Gas Demand Actuals - Forecasting API

The Gas Demand API provides endpoints to retrieve gas demand data and forecast information. The machine learning model required to forecast data was developed in Python: 

- Despite being harder to deploy, Python still remains the best langauge for machine learning packages.
- Function was deployed in a Dockerised container and exposed with a flask API.

You can find this python project here: 

https://github.com/cognitivebusiness/cognitive-assistant-python

### Base URL 
``` 
http://localhost:3001/api/v1/
```

## Endpoints

### Get Gas Demand Actuals & Forecast

Retrieve gas demand data between a specific date range.

- URL:  /gasdemand/{network}/actual_forecast
- Method: GET
- Parameters:
    - network: The network identifier (e.g., westmidlands, london)
    - start: The start date of the data range (format: YYYY-MM-DD)
    - end: The end date of the data range (format: YYYY-MM-DD)
- Response:
    - Status: 200 OK
    - Body: An array of gas demand data objects
        - actual_forecast: "F" forecated value, "A" actual value

``` 
    [{
        "id": 9980,
        "date": "2023-06-02",
        "network": "westmidlands",
        "gas_demand": 5.26471,
        "actual_forecast": "A",
        "uploaded_at": "2023-07-11T17:32:30.217Z"
    }]
 ```
 Example URL

### Get Gas Demand Hindcast & Forecast

Retrieve gas demand data between a specific date range.

- URL:  /gasdemand/{network}/hindcast_forecast
- Method: GET
- Parameters:
    - network: The network identifier (e.g., westmidlands, northlondon etc.)
    - start: The start date of the data range (format: YYYY-MM-DD)
    - end: The end date of the data range (format: YYYY-MM-DD)
- Response:
    - Status: 200 OK
    - Body: An array of gas demand data objects

``` 
    [{
        "id": 528,
        "date": "2023-07-02",
        "network": "westmidlands",
        "gas_demand": 3.86522,
        "actual_forecast": "F",
        "uploaded_at": "2023-07-07T15:02:45.114Z"
    }]
 ```
  Example URL

### Get Weather Hindcast & Forecast Data

Retrieve weather data between a specific date range.

- URL:  /weatherdata/{network}/getdata
- Method: GET
- Parameters:
    - network: The network identifier (e.g., westmidlands, northlondon etc.)
    - start: The start date of the data range (format: YYYY-MM-DD)
    - end: The end date of the data range (format: YYYY-MM-DD)
- Response:
    - Status: 200 OK
    - Body: An array of weather data objects

``` 
    [{
        "id": 204795,
        "date": "2023-07-01",
        "grid_id": "52.50000_-1.50000",
        "windSpeed_min": 4.04,
        "airTemperature_min": 12.41,
        "humidity_min": 51.21,
        "windSpeed_median": 6.16,
        "airTemperature_median": 16.25,
        "humidity_median": 68.02,
        "windSpeed_max": 8.75,
        "airTemperature_max": 19.1,
        "humidity_max": 92.53,
        "precipitation": 0.05,
        "uploaded_at": "2023-07-11T11:03:16.000Z"
    }]
 ```
  Example URL

### Post Run Machine Learning Algorithmn

Run gas demand forecast for specific date range.

- URL:  /gasdemand/{network}/runforecast
- Method: POST
- Parameters:
    - network: The network identifier (e.g., westmidlands, northlondon etc.)
    - start: The start date of the data range (format: YYYY-MM-DD)
    - end: The end date of the data range (format: YYYY-MM-DD)
- Response:
    - Status: 200 OK
    - Body: Message confirmation

``` 
{
    "message": "Machine Learning Model currently training for the eastanglia network between the dates 2023-07-10 - 2023-07-20"
}
 ```
  Example URL

### Post Download Historic Gas Demand Data

Run gas demand forecast for specific date range.

- URL:  /gasdemand/{network}/runhistoricdownload
- Method: POST
- Parameters:
    - network: The network identifier (e.g., westmidlands, northlondon etc.)
    - start: The start date of the data range (format: YYYY-MM-DD)
    - end: The end date of the data range (format: YYYY-MM-DD)
- Response:
    - Status: 200 OK
    - Body: Message confirmation

``` 
{
    "message": "Gas demand data uploaded between the dates 2023-07-04 - 2023-07-11 for westmidlands"
}
 ```

### Get Network Lat Lng Grid Information

Return the midpoint lat/lng of grids making up network weather.

- URL:  /weatherdata/gridmapping
- Method: GET
- Response:
    - Status: 200 OK
    - Body: An array of grid objects
``` 
    [{
        "id": 1,
        "grid_id": "51.50000_-0.50000",
        "plant": "GDUK EAST ANGLIA",
        "latitude": 51.5,
        "longitude": -0.5
    }]
 ```

### Get list of Available Networks

Return the midpoint lat/lng of grids making up network weather.

- URL:  /weatherdata/networks
- Method: GET
- Response:
    - Status: 200 OK
    - Body: An array of network objects
``` 
    [{
        "id": 2,
        "network": "eastmidlands"
    }]
 ```

## Example URL

### GET REQESTS
``` 
{baseURL}/gasdemand/westmidlands/actual_forecast?start=2023-06-01&end=2023-07-20

{baseURL}/gasdemand/westmidlands/hindcast_forecast?start=2023-07-01&end=2023-07-20

{baseURL}/weatherdata/westmidlands/getdata?start=2023-07-01&end=2023-07-20

{baseURL}/weatherdata/gridmapping

{baseURL}/weatherdata/network

```

### POST REQESTS
``` 
{baseURL}/weatherdata/eastanglia/download?start=2023-07-10&end=2023-07-20

{baseURL}/gasdemand/eastanglia/runforecast?start=2023-07-10&end=2023-07-20

{baseURL}/gasdemand/westmidlands/runhistoricdownload?start=2023-07-04&end=2023-07-11

```