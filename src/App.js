import React, { useState, useEffect } from "react";
import "./App.css";

// ✅ Mock Data for Testing (Local)
const mockCountries = [
  "India",
  "Australia",
  "United States",
  "Canada",
  "Brazil",
  "Germany",
  "France",
  "Japan",
  "China",
  "South Africa",
  // add more if needed to exceed 283
];
while (mockCountries.length < 300) mockCountries.push("Country" + mockCountries.length);

const mockStates = {
  India: [
    "Andhra Pradesh",
    "Goa",
    "Gujarat",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Kerala",
  ],
  Australia: ["New South Wales", "Victoria", "Western Australia"],
};

const mockCities = {
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Canacona", "Bicholim", "Quepem", "Sanguem", "Curchorem", "Valpoi", "Cuncolim"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  "Western Australia": ["Perth", "Bunbury", "Broome"],
};

// ✅ Mock Fetch Function (simulates API)
const mockFetch = (url) => {
  return new Promise((resolve, reject) => {
    if (url.includes("/countries")) {
      resolve({ ok: true, json: () => Promise.resolve(mockCountries) });
    } else if (url.includes("/country=India/states")) {
      resolve({ ok: true, json: () => Promise.resolve(mockStates["India"]) });
    } else if (url.includes("/country=Australia/states")) {
      resolve({ ok: true, json: () => Promise.resolve(mockStates["Australia"]) });
    } else if (url.includes("/country=India/state=Goa/cities")) {
      resolve({ ok: true, json: () => Promise.resolve(mockCities["Goa"]) });
    } else {
      reject(new Error("Invalid URL"));
    }
  });
};

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const BASE_URL = "https://crio-location-selector.onrender.com";

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await mockFetch(`${BASE_URL}/countries`);
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]); // for Cypress error handling
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    if (country) {
      try {
        const response = await mockFetch(`${BASE_URL}/country=${country}/states`);
        if (!response.ok) throw new Error("Failed to fetch states");
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      }
    }
  };

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    if (state) {
      try {
        const response = await mockFetch(`${BASE_URL}/country=${selectedCountry}/state=${state}/cities`);
        if (!response.ok) throw new Error("Failed to fetch cities");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    }
  };

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
          {countries.map((country, index) => (
            <option key={index} value={country}>
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
          {states.map((state, index) => (
            <option key={index} value={state}>
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
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <p className="result">
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </div>
  );
}

export default App;
