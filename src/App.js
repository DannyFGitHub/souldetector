import "./App.css";
import { useState } from "react";

import { submitRequest, loadRequests } from "./firebase";

function App() {
  const [text, setText] = useState("");
  const [requests, setRequests] = useState({});

  function onSubmitRequest() {
    submitRequest(text);
  }

  function onLoadRequests() {
    loadRequests(function (id, request, response, status) {
      setRequests((prev) => {
        return {
          ...prev,
          [id]: {
            request,
            response,
            status,
          },
        };
      });
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* Multiline input */}
        <textarea
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={onSubmitRequest}>Submit</button>
        <button onClick={onLoadRequests}>Load</button>
        <div>
          {Object.keys(requests).map((id, index) => {
            const request = requests[id];
            let stats = {};
            if (request.response !== undefined) {
              stats.status = request.response[0].status
                ? request.response[0].status
                : "No status";
              stats.burstiness = request.response[0].Burstiness
                ? request.response[0].Burstiness
                : "No burstiness";
              stats.perplexity = request.response[0].Perplexity
                ? request.response[0].Perplexity
                : "No perplexity";
              stats.perplexityPerLine = request.response[0][
                "Perplexity per line"
              ]
                ? request.response[0]["Perplexity per line"]
                : "No perplexityPerLine";
              stats.label = request.response[0].label
                ? request.response[0].label
                : "No label";
              stats.description = request.response[1];
            }
            return (
              <div key={id}>
                <div>{index}</div>
                {/* Table for stats*/}
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Burstiness</th>
                      <th>Perplexity</th>
                      <th>PerplexityPerLine</th>
                      <th>Label</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{stats.status}</td>
                      <td>{stats.burstiness}</td>
                      <td>{stats.perplexity}</td>
                      <td>{stats.perplexityPerLine}</td>
                      <td>{stats.label}</td>
                      <td>{stats.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
