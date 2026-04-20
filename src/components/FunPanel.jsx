import React, { useState, useEffect } from 'react';
import './FunPanel.css';

const TRIVIA = {
  storm: [
    'Lightning strikes Earth about 100 times per second!',
    'Thunder is the sound of air expanding rapidly as lightning superheats it to 30,000 K.',
    'A single bolt of lightning is 5× hotter than the surface of the sun.',
  ],
  rain: [
    "The smell of rain has a name: Petrichor — coined by scientists in 1964.",
    'Raindrops fall at about 9 m/s, but speed varies dramatically by drop size.',
    "Earth recycles its water — today's rain may have once been dinosaur sweat!",
  ],
  drizzle: [
    'Drizzle drops are smaller than 0.5 mm in diameter.',
    'Drizzle can make roads slipperier than heavy rain due to oily road residue.',
    'Coastal cities often experience drizzle from sea breezes meeting cool air.',
  ],
  snow: [
    'No two snowflakes are exactly alike — each has a unique crystalline structure.',
    'Snow is translucent, not white — light bouncing off ice crystals makes it appear white.',
    'The snowiest recorded season: 1,140 inches at Mt. Baker, Washington (1998–99).',
  ],
  fog: [
    'Fog is essentially a cloud that forms at ground level.',
    "London's famous Victorian fogs were actually smog — a toxic mix of fog and coal smoke.",
    'Fog can reduce visibility to just a few meters — as dark as a moonless night.',
  ],
  clear: [
    "The sun's light takes exactly 8 minutes and 20 seconds to reach Earth.",
    'On a perfectly clear day you can see up to 5 km on flat ground from eye-level.',
    'Sunlight is white — a prism splits it into all the colors of the rainbow.',
  ],
  cloudy: [
    'A typical cumulus cloud weighs about 500,000 kg — yet it floats!',
    'Clouds form when water vapor cools and condenses around tiny airborne particles.',
    'Noctilucent clouds form 80+ km up and glow electric blue at night.',
  ],
};

const getWeatherTheme = (id) => {
  if (!id) return 'clear';
  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800) return 'clear';
  return 'cloudy';
};

const getOutfit = (temp, weatherId, units) => {
  const c = units === 'imperial' ? ((temp - 32) * 5) / 9 : temp;
  const theme = getWeatherTheme(weatherId);
  let base, emoji;

  if (c < 0)       { base = 'Heavy coat, thermals, gloves & scarf'; emoji = '🧥🧤'; }
  else if (c < 10) { base = 'Warm coat and closed-toe shoes';        emoji = '🧥';   }
  else if (c < 16) { base = 'Light jacket or a cozy hoodie';         emoji = '🧤';   }
  else if (c < 22) { base = 'Long sleeves or a light sweater';       emoji = '👕';   }
  else if (c < 28) { base = 'T-shirt and shorts — enjoy it!';        emoji = '😎';   }
  else             { base = 'Light, breathable clothes + sunscreen!'; emoji = '🌞';   }

  if (theme === 'rain' || theme === 'drizzle') { base += ' + bring an umbrella'; emoji += '☂️'; }
  else if (theme === 'storm') { base += ' — consider staying indoors'; emoji = '⛈️'; }
  else if (theme === 'snow')  { base += ' + waterproof boots a must'; emoji += '⛄'; }

  return { text: base, emoji };
};

const getMood = (weatherId, temp, units) => {
  const c = units === 'imperial' ? ((temp - 32) * 5) / 9 : temp;
  const theme = getWeatherTheme(weatherId);
  const moods = {
    storm:   ['⚡ Feeling dramatic and electric today', '🌩️ Stormy, introspective vibes', '⛈️ Turbulent but powerful energy'],
    rain:    ['💧 Cozy and contemplative today', '🌧️ Perfect excuse to stay in and read', '☔ Beautifully melancholic'],
    drizzle: ['🌦️ Softly moody with a light drizzle of feelings', '💨 Gently damp but coping', '🌂 Quietly reflective'],
    snow:    ['❄️ Serene, quiet and magical today', '⛄ Crisp, playful and cold', '🌨️ Peaceful as fresh snowfall'],
    fog:     ['🌫️ Mysterious and hard to read today', '😶‍🌫️ Enigmatic and ethereal', '🌁 Pensive, lost in a fog of thoughts'],
    clear:   c > 28
      ? ['🔥 Blazing with energy — maybe too much', '☀️ Fired up and unstoppably sunny', '😅 Sunny, sweaty, and thriving']
      : ['✨ Clear-headed and radiantly brilliant', '☀️ Full of cheerful potential today', '😊 Absolutely beaming with positivity'],
    cloudy:  ['☁️ Thoughtful and a bit overcast', '🌤️ Partly optimistic, partly meh', '😐 Neither here nor there — just vibing'],
  };
  const options = moods[theme] || moods.clear;
  return options[Math.floor(Date.now() / 3_600_000) % options.length];
};

const FunPanel = ({ weather, units, streak }) => {
  const theme = getWeatherTheme(weather.weatherId);
  const triviaList = TRIVIA[theme] || TRIVIA.clear;
  const [triviaIdx, setTriviaIdx] = useState(0);
  const outfit = getOutfit(weather.temp, weather.weatherId, units);
  const mood   = getMood(weather.weatherId, weather.temp, units);

  useEffect(() => {
    const id = setInterval(() => setTriviaIdx((i) => (i + 1) % triviaList.length), 7000);
    return () => clearInterval(id);
  }, [triviaList.length]);

  return (
    <div className="fun-panel">
      <div className="fun-card trivia-card">
        <div className="fun-card-header">🧠 Did You Know?</div>
        <p className="fun-card-body trivia-body" key={triviaIdx}>{triviaList[triviaIdx]}</p>
        <div className="trivia-dots">
          {triviaList.map((_, i) => (
            <button
              key={i}
              className={`trivia-dot ${i === triviaIdx ? 'active' : ''}`}
              onClick={() => setTriviaIdx(i)}
              aria-label={`Trivia ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="fun-card outfit-card">
        <div className="fun-card-header">👗 What to Wear</div>
        <div className="outfit-emoji">{outfit.emoji}</div>
        <p className="fun-card-body">{outfit.text}</p>
      </div>

      <div className="fun-card mood-card">
        <div className="fun-card-header">🎭 Weather Mood</div>
        <p className="fun-card-body mood-body">{mood}</p>
        {streak.count > 1 && (
          <div className="streak-pill">🔥 {streak.count}-day check-in streak!</div>
        )}
      </div>
    </div>
  );
};

export default FunPanel;
