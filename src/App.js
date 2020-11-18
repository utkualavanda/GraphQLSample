import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import Animes from "./components/Animes/Animes";

function App() {
  const client = new ApolloClient({
    uri: "https://graphql.anilist.co",
  });

  return (
    <ApolloProvider client={client}>
      <Animes></Animes>
    </ApolloProvider>
  );
}

export default App;
