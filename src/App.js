import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const json = await response.json();
        setData(json);
        setOffline(false);
      } catch (error) {
        console.error(error);
        setOffline(true);
        // Intentar obtener datos de caché
        const cache = await caches.open("my-app-cache");
        const cachedResponse = await cache.match(
          "https://jsonplaceholder.typicode.com/todos"
        );
        if (cachedResponse) {
          const json = await cachedResponse.json();
          setData(json);
        }
      }
    };

    //if comes back online, execute this the testPostOffline function if there is any data in the cache
    window.addEventListener("online", () => {
      console.log("came back online");
      testPostOffline();
    });
    

    fetchData();
  }, []);

  const testPostOffline = () => {

    if (!navigator.onLine) {
      alert("Estás desconectado. la operacion se realizará en caché y se enviará cuando estés conectado");

      // Guardar en caché
      caches.open('my-app-cache').then(function(cache) {
        return cache.addAll([
          "http://localhost:3000/developers/add",
          // Agregar aquí cualquier otro recurso que se quiera cachear
        ]);
      })

      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "name": "test",
      "lastname": "test",
      "email": "test@gmail.com"
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:3000/developers/add", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  return (
    <div>
      <button type="button" onClick={() => testPostOffline()}>Click to post</button>

      {offline ? (
        <p>Estás desconectado. Se mostrarán datos en caché.</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default App;
