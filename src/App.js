import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Animes from "./components/Animes/Animes";

const App = () => {
  const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
    cache: new InMemoryCache(),
  });

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Animes />
      </ApolloProvider>
    </div>
  );
}

export default App;
