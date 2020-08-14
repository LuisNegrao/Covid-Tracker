import React, { useState, useEffect } from "react";
import "./App.css";
import { sortData, prettyPrintStat, prettyPrintStats } from "./util";
import Map from "./Componets/Map";
import Table from "./Componets/Table";
import InfoBox from "./Componets/InfoBox";
import LineGraph from "./Componets/LineGraph";
import "leaflet/dist/leaflet.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

function App() { 
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("WorldWide");
  const [countyState, setCountyState] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const countiesData = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          setCountries(countiesData);
        });
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCountyState(data);
        });
    };
    getCountries();
  }, []); // runs once when component loads and not again. [stuff] runs when also when stuff changes.

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    let url = "";

    if (countryCode === "WorldWide") {
      url = "https://disease.sh/v3/covid-19/all";
    } else {
      url = `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    }

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCountyState(data);
        if (countryCode === "WorldWide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(2.8);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="WorldWide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Covid Cases"
            cases={prettyPrintStat(countyState.todayCases) || 0}
            total={prettyPrintStats(countyState.cases) || 0}
          ></InfoBox>
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countyState.todayRecovered) || 0}
            total={prettyPrintStats(countyState.recovered) || 0}
          ></InfoBox>
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countyState.todayDeaths) || 0}
            total={prettyPrintStats(countyState.deaths) || 0}
          ></InfoBox>
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>Live Cases By Country</h2>
          <Table countries={tableData} />
          <h2 className="app__tabletext">WorldWide new {casesType}</h2>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
