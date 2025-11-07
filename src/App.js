import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [error, setError] = useState(null);

  // ✅ Base URL (New Official API)
  const BASE_URL = "https://location-selector.labs.crio.do";

  // ✅ Fetch all countries on initial render
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/countries`);
        if (!response.ok) throw new Error("Failed to load countries");

        const data = await response.json();
        // API returns array of strings (country names)
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("country");
        setCountries([]); // empty dropdown on failure
      }
    };

    fetchCountries();
  }, []);

  // ✅ Fetch states based on selected country
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    if (country) {
      try {
        const response = await fetch(`${BASE_URL}/country=${country}/states`);
        if (!response.ok) throw new Error("Failed to load states");

        const data = await response.json();
        // API returns array of strings (state names)
        setStates(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching states:", err);
        setError("state");
        setStates([]);
      }
    }
  };

  // ✅ Fetch cities based on selected state and country
  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    if (state) {
      try {
        const response = await fetch(
          `${BASE_URL}/country=${selectedCountry}/state=${state}/cities`
        );
        if (!response.ok) throw new Error("Failed to load cities");

        const data = await response.json();
        // API returns array of strings (city names)
        setCities(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("city");
        setCities([]);
      }
    }
  };

  // ✅ Select city
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="container">
      <h1>City Selector</h1>

      <div className="dropdown-container">
        {/* Country Dropdown */}
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Final Selection Display */}
      {selectedCity && (
        <p className="result">
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </div>
  );
}

export default App;
