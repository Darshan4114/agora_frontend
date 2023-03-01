import './App.css';
import React, { useState } from 'react';

function App() {
  const [address, setAddress] = useState('');

  const handleLocationSubmit = async () => {
    //Get form data
    let form = document.querySelector("form");
    let data = new FormData(form);
    const formData = {};
    for (var pair of data.entries()) {
      formData[pair[0]] = pair[1]
    }
    try {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${formData.latitude},${formData.longitude}&result_type=political&key=AIzaSyDaGDRlIrGc98vkOvpAz7xBagB-w06v80s`)
        .then((data) => data.json())
        .then((data)=> {
          const result = data.results.reverse().slice(1,2)[0];
          const city = result?.address_components[0].long_name;
          const country = result?.address_components[1].long_name;
          console.log('results', result);
          setAddress(`${city}, ${country}`);
        });
     
    } catch (error) {
      console.log('err', error);
    }
  }


  return (
    <div>
      <h2 style={{textAlign: 'center', fontSize: '2rem'}}>Reverse geocoding API test</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLocationSubmit()
      }}
        style={{display: 'flex', flexDirection: 'column', width: '15rem', margin: '0 auto'}}
      >
        <label for='latitude'>Latitude</label>
        <input name='latitude' style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem'}} required />
        <label for='longitude'>Longitude</label>
        <input name='longitude' style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem'}} required />
        <div style={{display: 'flex', gap: '1rem'}}>
          <input type='submit' value="Search" style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: 'none', background: '#0da5dc', flex: '1', borderRadius: '0.25em', color: '#fff', cursor: 'pointer'}} />
        </div>
      </form>

      <p style={{textAlign: 'center'}}>Address: {address && address}</p>
    </div>
  );
}

export default App;
