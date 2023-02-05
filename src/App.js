import "./App.css";
import { useState } from "react";

import { submitRequest, loadRequests } from "./firebase";

function App() {
  const [text, setText] = useState("");
  const [requests, setRequests] = useState({});

  function onSubmitRequest() {
    if (text.length >= 100) {
      submitRequest(text);
    } else {
      alert("Please enter at least 100 characters");
    }
  }

  function onLoadRequests() {
    console.log("Loading requests...");
    loadRequests(function (id, request, response, status, timestamp) {
      setRequests((prev) => {
        return {
          ...prev,
          [id]: {
            request,
            response,
            status,
            timestamp,
          },
        };
      });
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hassoul</h1>
        <p>
          <code>Detects the soul behind text</code>
        </p>
        <textarea
          className="textarea"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <span>
          <button className="btn" onClick={onSubmitRequest}>
            Submit
          </button>
          <button className="btn" onClick={onLoadRequests}>
            Load
          </button>
        </span>
        <div className="App-table">
          <table className="table">
            <thead>
              <tr>
                <th>Request Number</th>
                <th>Status</th>
                <th>Text</th>
                <th>Stats</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(requests)
                .sort((itema, itemb) => {
                  return requests[itemb].timestamp - requests[itema].timestamp;
                })
                .map((id, index) => {
                  const request = requests[id];
                  let stats = {};
                  if (request.response !== undefined) {
                    stats.status = request.response[0].status
                      ? request.response[0].status
                      : request.status;
                    stats.burstiness = request.response[0].Burstiness
                      ? request.response[0].Burstiness
                      : "No burstiness";
                    stats.perplexity = request.response[0].Perplexity
                      ? request.response[0].Perplexity
                      : "No perplexity";
                    stats.perplexityPerLine = request.response[0][
                      "Perplexity per line"
                    ]
                      ? parseInt(request.response[0]["Perplexity per line"])
                      : "No perplexityPerLine";
                    stats.label = request.response[0].label
                      ? request.response[0].label
                      : "No label";
                    stats.description = request.response[1];
                  } else {
                    stats.status = request.status;
                  }
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>{stats.status}</td>
                      <td>{request.request.slice(0, 50) + "..."}</td>
                      <td>
                        <div>
                          <span>Burstiness: {stats.burstiness}</span>
                        </div>
                        <div>
                          <span>Perplexity: {stats.perplexity}</span>
                        </div>
                        <div>
                          <span>
                            PerplexityPerLine: {stats.perplexityPerLine}
                          </span>
                        </div>
                      </td>
                      <td>{stats.description}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
