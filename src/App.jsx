import React, { useEffect, useState } from 'react';
import './styles.css';

// Lugares públicos de interés.
const routes = [
  { day: 'Día 1 · Miércoles 14', time: 'Mañana', title: 'Visita guiada a la Mezquita-Catedral · 11:00', stops: [
    ['11:00 · Visita guiada a la Mezquita-Catedral', 'Mezquita-Catedral de Córdoba'],
    ['Calleja de las Flores'],
    ['Calleja del Pañuelo'],
    ['Zoco Municipal', 'Zoco Municipal de Córdoba'],
    ['Sinagoga', 'Sinagoga de Córdoba'],
  ]},
  { day: 'Día 1 · Miércoles 14', time: 'Tarde', title: 'Muralla, callejas y ribera', stops: [
    ['Calleja del Salmorejo Cordobés'],
    ['Calleja de la Luna'],
    ['Calle de la Muralla o Cairuán', 'Calle Cairuán Córdoba'],
    ['Puerta del Puente'],
  ]},
  { day: 'Día 2 · Jueves 15', time: 'Mañana', title: 'Free tour de Córdoba · 11:00', stops: [
    ['11:00 · Quedada del free tour: Plaza de las Tendillas, junto a la fuente', '37.884458,-4.779601'],
    ['Cuesta del Bailío'],
    ['Palacio de Viana'],
    ['Patios y plazas de Santa Marina', 'Patios y plazas barrio de Santa Marina Córdoba'],

  ]},
  { day: 'Día 2 · Jueves 15', time: 'Tarde', title: 'Corredera y Templo Romano', stops: [
    ['Plaza de la Corredera'],
    ['Templo Romano', 'Templo Romano de Córdoba'],
    ['Iglesia de San Lorenzo'],
    ['Calleja de los Arquillos'],
  ]},
  { day: 'Día 3 · Viernes 16', time: 'Mañana', title: 'Puente Romano y ribera del Guadalquivir', stops: [
    ['Puente Romano', 'Puente Romano de Córdoba'],
    ['Torre de la Calahorra'],
    ['Ribera del Guadalquivir', 'Ribera del Guadalquivir Córdoba'],
  ]},
  { day: 'Día 3 · Viernes 16', time: 'Tarde', title: 'Jardín Botánico y San Basilio', stops: [
    ['Jardín Botánico', 'Real Jardín Botánico de Córdoba IMGEMA'],
    ['Caballerizas Reales'],
    ['Barrio de San Basilio'],
  ]},
];

const bars = [
  ['La Maceta', 'Pl. del Escudo, 1, Centro, 14008 Córdoba'],
  ['Bar Santos', 'Calle Magistral González Francés, frente a la Mezquita-Catedral, Córdoba'],
  ['Taberna Góngora', 'Calle Conde de Torres Cabrera, Córdoba'],
  ['Las Tapas de Casa Pepe', 'Calle Romero, junto a Casa Pepe de la Judería, Córdoba'],
  ['Bodega Guzmán', 'Calle Judíos, junto a la Sinagoga, Córdoba'],
  ['El Sótano', 'Plaza de la Corredera, Córdoba'],
  ['La Despensa de la Corredera', 'Plaza de la Corredera, Córdoba'],
  ['Moriles Ribera', 'Ronda de Isasa, Córdoba'],
  ['La Siesta', 'Ronda de Isasa, Córdoba'],
];


function mapsSearch(place) {
  if (/^-?\d+\.\d+,-?\d+\.\d+$/.test(place)) {
    return `https://www.google.es/maps/dir//${place}/@${place},16z`;
  }
  const query = encodeURIComponent(`${place}, Córdoba, España`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
function PhotoGallery({ photos, label }) {
  return (
    <div className="photo-gallery" aria-label={label}>
      {photos.map(photo => (
        <figure className="photo-card" key={photo.src}>
          <img src={photo.src} alt={photo.alt} loading="lazy" />
          <figcaption>{photo.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const weatherWords = {
  0:['Despejado','☀️'],1:['Mayormente despejado','🌤️'],2:['Algo nuboso','⛅'],3:['Nublado','☁️'],
  45:['Niebla','🌫️'],48:['Niebla','🌫️'],51:['Llovizna ligera','🌦️'],53:['Llovizna','🌦️'],55:['Llovizna intensa','🌧️'],
  56:['Llovizna helada','🌧️'],57:['Llovizna helada','🌧️'],61:['Lluvia ligera','🌦️'],63:['Lluvia','🌧️'],65:['Lluvia intensa','🌧️'],
  66:['Lluvia helada','🌧️'],67:['Lluvia helada','🌧️'],71:['Nieve ligera','❄️'],73:['Nieve','❄️'],75:['Nieve intensa','❄️'],77:['Granizo pequeño','❄️'],
  80:['Chubascos ligeros','🌦️'],81:['Chubascos','🌧️'],82:['Chubascos intensos','🌧️'],85:['Chubascos de nieve','🌨️'],86:['Chubascos de nieve','🌨️'],
  95:['Tormenta','⛈️'],96:['Tormenta con granizo','⛈️'],99:['Tormenta con granizo','⛈️'],
};
const forecastDates = [
  {date:'2026-10-13',weekday:'Martes',day:'13'},
  {date:'2026-10-14',weekday:'Miércoles',day:'14'},
  {date:'2026-10-15',weekday:'Jueves',day:'15'},
  {date:'2026-10-16',weekday:'Viernes',day:'16'},
  {date:'2026-10-17',weekday:'Sábado',day:'17'},
];
const forecastTimes = ['10:00','15:00','21:00'];
function weatherDescription(code) { return weatherWords[code] || ['Tiempo variable','🌤️']; }
function WeatherSection() {
  const [forecast,setForecast]=useState(null);
  const [error,setError]=useState('');
  const [updated,setUpdated]=useState('');
  const [loading,setLoading]=useState(true);
  const [requestId,setRequestId]=useState(0);
  useEffect(()=>{
    let active=true;
    async function refresh(){
      setLoading(true);
      try{
        const params=new URLSearchParams({latitude:'37.8882',longitude:'-4.7794',hourly:'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',timezone:'Europe/Madrid',start_date:'2026-10-13',end_date:'2026-10-17'});
        const response=await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`,{cache:'no-store'});
        if(!response.ok) throw new Error('No se pudo consultar la previsión.');
        const result=await response.json();
        if(active){setForecast(result.hourly);setError('');setUpdated(new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(new Date()));setLoading(false);}
      }catch{if(active){setError('No se pudo cargar la previsión. Comprueba la conexión a Internet.');setLoading(false);}}
    }
    refresh();
    return ()=>{active=false;};
  },[requestId]);
  function refreshForecast(){setError('');setRequestId(value=>value+1);}
  return(
    <section className="weather-section" aria-label="Previsión del tiempo en Córdoba">
      <div className="weather-heading">
        <p className="eyebrow">PREVISIÓN PARA EL VIAJE</p>
        <h2>El tiempo en <em>Córdoba.</em></h2>
          <PhotoGallery label="Elena con frío y con calor" photos={[
          {src:`${import.meta.env.BASE_URL}elena%20con%20frio.jpeg`,alt:'Elena con frío',caption:'ELENA VESTIDA SI TIENE FRÍO'},
          {src:`${import.meta.env.BASE_URL}elena%20con%20calor.jpeg`,alt:'Elena con calor',caption:'ELENA VESTIDA SI TIENE CALOR'},
        ]} />
        <p>Martes 13 a sábado 17 de octubre · hora local</p>
        <p><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Datos meteorológicos: Open-Meteo</a></p>
        <button className="button button-dark weather-refresh" type="button" onClick={refreshForecast} disabled={loading}>
          {loading ? 'Actualizando…' : 'Actualizar previsión'}
        </button>
      </div>
      {loading&&!forecast&&<p className="weather-status">Consultando la previsión…</p>}
      {error&&!forecast&&<p className="weather-status">{error}</p>}
      {forecast&&<div className="weather-timeline">
        {forecastDates.map(day=><article className="weather-day" key={day.date}>
          <div className="weather-day-label"><strong>{day.weekday}</strong><time>{day.day} oct.</time></div>
          <div className="weather-readings">{forecastTimes.map(hour=>{
            const index=forecast.time.findIndex(value=>value.startsWith(`${day.date}T${hour}`));
            if(index<0)return <div className="weather-reading weather-missing" key={`${day.date}-${hour}`}><time>{hour}</time><p>Sin dato</p></div>;
            const [description,icon]=weatherDescription(forecast.weather_code[index]);
            return <div className="weather-reading" key={`${day.date}-${hour}`}>
              <time>{hour}</time><span className="weather-icon" aria-hidden="true">{icon}</span>
              <strong>{Math.round(forecast.temperature_2m[index])}°</strong>
              <p>{description}</p><small>{forecast.precipitation_probability[index] ?? '—'}% lluvia</small>
            </div>;
          })}</div>
        </article>)}
      </div>}
      <div className="weather-updated">{updated&&`Actualizado a las ${updated}`}{error&&forecast&&<span> · Se mantiene el último dato cargado</span>}</div>
    </section>
  );
}
function Stop({ name, search, number }) {
  return (
    <li className="stop">
      <span className="pin"><span>{String(number).padStart(2, '0')}</span></span>
      <a className="stop-link" href={mapsSearch(search || name)} target="_blank" rel="noreferrer">
        <span>{name}</span><span className="map-label">Abrir mapa ↗</span>
      </a>
    </li>
  );
}

function RouteBlock({ route, index }) {
  const places = route.stops.map(([name, search]) => ({ name, search }));
  const directions = `https://www.google.com/maps/dir/${places.map(p => encodeURIComponent(`${p.search || p.name}, Córdoba`)).join('/')}/`;
  return (
    <section className="route-block" id={`tramo-${index + 1}`}>
      <div className="block-heading">
        <span className="sun-icon" aria-hidden="true">{route.time === 'Mañana' ? '☀' : '◒'}</span>
        <div><p className="eyebrow">{route.day} · {route.time}</p><h3>{route.title}</h3></div>
        <a className="open-route" href={directions} target="_blank" rel="noreferrer">Ver tramo ↗</a>
      </div>
      <ol className="stops-list">{places.map((place, i) => <Stop key={place.name} {...place} number={i + 1} />)}</ol>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <header className="hero">
    <div className="hero-top"><span className="brand-mark">C</span><span>Córdoba · Andalucía</span><a href="#ruta">Ver ruta ↓</a></div>
            <div className="hero-copy">
          <p className="eyebrow">DEL MARTES 13 DE OCTUBRE AL SÁBADO 17 DE OCTUBRE</p>
          <h1>Elena<br /><em>en Córdoba</em></h1>
          <p className="hero-intro">Aquí podéis ver que visita Elena en Córdoba</p>
          <a className="button button-terracotta" href="#ruta">Empezar recorrido ↓</a>
        </div>
        <div className="hero-stamp"><span>3</span><small>DÍAS<br />A PIE</small></div>
        <div className="hero-bottom"><span>CÓRDOBA · ESPAÑA</span><span>6 TRAMOS · 23 LUGARES</span></div>
      </header>

      <nav className="quick-nav" aria-label="Índice de rutas">
        {routes.map((route, i) => <a key={i} href={`#tramo-${i + 1}`}><span>0{i + 1}</span>{route.day} · {route.time}</a>)}
      </nav>

      <section className="route-section" id="ruta">
        <div className="train-schedule">
            <h3>Horario de tren <em>ida y vuelta</em></h3>
              <PhotoGallery label="Fotos para los viajes de ida y vuelta" photos={[
              {src:`${import.meta.env.BASE_URL}preparada.jpeg`, alt:'Elena preparada para el viaje', caption:'ELENA EMPIEZA EL VIAJE'},
            ]} />
            <p><strong>Tren de ida:</strong> Martes a las 15h en Puerta de Atocha · llegada a las 17h.</p>
            <p><strong>Tren de vuelta:</strong> Sábado a las 18:20h en Córdoba · llegada a las 20:15h.</p>
            <p><strong>Check-in:</strong> en Airbnb entre las 17h y las 18h.</p>
            <p><strong>Check-out:</strong> en Airbnb a las 11h.</p>
          </div>
        <div className="section-intro">
          <p className="eyebrow">EL RECORRIDO</p>
          <h2>La ruta de Elena<br /><em>en Córdoba.</em></h2>
          <p className="route-map-hint">Pulsa cualquier parada para verla en Google Maps.</p>
            <PhotoGallery label="Elena empezando" photos={[
            {src:`${import.meta.env.BASE_URL}ready.jpeg`,alt:'Elena empezando',caption:'ELENA PREPARADA PARA EMPEZAR LA RUTA'},
          ]} />
        </div>
        
        <div className="route-timeline">
          {routes.map((route, i) => <RouteBlock key={`${route.day}-${route.time}`} route={route} index={i} />)}
                    <PhotoGallery label="Elena durmiendo" photos={[
            {src: `${import.meta.env.BASE_URL}elena%20durmiendo.jpeg`,alt:'Elena durmiendo',caption:'CÓMO ACABARÁ ELENA SI CAMINA TODO ESTO'},
          ]} />
        
        </div>
      </section>

      <section className="bars-section" aria-labelledby="bars-title">
        <div className="bars-heading">
          <p className="eyebrow">PARA HACER UNA PARADA</p>
          <h2 id="bars-title">Bares <em>de Córdoba.</em></h2>
            <PhotoGallery label="Elena comiendo y bebiendo" photos={[
            {src:`${import.meta.env.BASE_URL}elena%20comiendo.jpeg`,alt:'Elena comiendo',caption:'LO QUE VA A HACER ELENA (COMER)'},
            {src:`${import.meta.env.BASE_URL}elena%20bebiendo.jpeg`,alt:'Elena bebiendo',caption:'LO QUE NO VA A HACER ELENA (BEBER ALCOHOL)'},
          ]} />
        </div>
        <ol className="bars-list">
          {bars.map(([name, location]) => (
            <li className="bar-item" key={name}>
              <h3>{name}</h3>
              <a href={mapsSearch(location)} target="_blank" rel="noreferrer" aria-label={`Ubicación de ${name}: ${location}`}>
                {location}<span aria-hidden="true"> ↗</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <WeatherSection />

      <footer><span>CÓRDOBA A PIE</span><a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Volver arriba ↑</a></footer>
    </main>
  );
}



