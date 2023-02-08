import "./App.css";
import { useEffect, useState } from "react";
import Loader from "react-loaders";

import { submitRequest, loadRequests } from "./firebase";

const AI_THRESHOLD_PERCENTAGE = 80;

function App() {
  const [text, setText] = useState("");
  const [requests, setRequests] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function onSubmitRequest() {
    if (text.length >= 100) {
      submitRequest(text);
      setText("");
    } else {
      alert("Please enter at least 100 characters");
    }
  }

  // Refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      onLoadRequests();
    }, 8000);
    return () => clearInterval(interval);
  }, [isLoading]);

  function onLoadRequests() {
    console.log("Loading requests...");
    loadRequests(function (total, id, request, response, status, timestamp) {
      setRequests((prev) => {
        let updatedRequestsObject = {
          ...prev,
          [id]: {
            request,
            response,
            status,
            timestamp,
          },
        };

        if (Object.keys(updatedRequestsObject).length === total) {
          setIsLoading(false);
        }

        return updatedRequestsObject;
      });
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="App-logo-container"
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <img
              src={process.env.PUBLIC_URL + "/logo512.png"}
              alt="logo"
              className="App-logo"
            />
          </div>
          <h1>AI Detection</h1>
        </div>
        <p>
          <code>NLP Transformer Perplexity Analyzer</code>
        </p>
        <textarea
          className="textarea"
          type="text"
          value={text}
          onChange={(e) =>
            setText(e.target.value ? e.target.value.replace(/\s+/g, " ") : "")
          }
        />
        <span>
          <button className="btn" onClick={onSubmitRequest}>
            Submit
          </button>
          {/* <button className="btn" onClick={onLoadRequests}>
            Load
          </button> */}
        </span>
        <div>
          {isLoading ? (
            <Loader type="line-scale" active />
          ) : (
            <span
              style={{ color: "white", marginTop: "10px", fontSize: "1.5rem" }}
            >
              Scroll to see {Object.keys(requests).length} submissions
            </span>
          )}
        </div>
        <div className="App-table">
          <table className="table">
            <thead>
              <tr>
                <th>Request Number</th>
                <th>For Text That Begins</th>
                <th>Stats</th>
                <th>Score</th>
                <th>AI Percentage</th>
                <th>Status</th>
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
                    stats.aiPercent =
                      request.response[0]["AI Lines Percent"] +
                        "% could be AI" ?? "";
                    stats.pplSTDDisplay =
                      request.response[0]["Perplexity per line display"] ?? "";
                  } else {
                    stats.status = request.status;
                  }
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>

                      <td>{request.request.slice(0, 20) + "..."}</td>
                      <td>
                        <div>
                          <span>Max Perplexity: {stats.burstiness}</span>
                        </div>
                        <div>
                          <span>Perplexity: {stats.perplexity}</span>
                        </div>
                        <div>
                          <span>
                            PerplexityPerLine: {stats.perplexityPerLine}
                          </span>
                        </div>
                        <div>
                          <span>Std: {stats.pplSTDDisplay}</span>
                        </div>
                      </td>
                      <td>{stats.description}</td>
                      <td>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            color:
                              parseFloat(stats.aiPercent) >
                              AI_THRESHOLD_PERCENTAGE
                                ? "red"
                                : "green",
                            fontWeight: "bold",
                          }}
                        >
                          <div
                            style={{
                              width: stats.aiPercent
                                ? parseFloat(stats.aiPercent) + "%"
                                : "0%",
                              height: "100%",
                              backgroundColor:
                                parseFloat(stats.aiPercent) >
                                AI_THRESHOLD_PERCENTAGE
                                  ? "red"
                                  : "green",
                              borderRadius: "5px",
                              textAlign: "right",
                              padding: "5px",
                            }}
                          ></div>
                          {stats.aiPercent}
                        </div>
                      </td>
                      <td>{stats.status}</td>
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
