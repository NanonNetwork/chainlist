import { SimpleGrid } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Chain } from "./Chain";
import { SearchContext } from "../context/SearchContext";
import { graphql, useStaticQuery } from "gatsby";

export const ChainList = () => {
  const data = useStaticQuery(graphql`
    {
      allChain(sort: [{ chainId: ASC }]) {
        nodes {
          id
          name
          chain
          chainId
          rpc
          icon {
            publicURL
            childImageSharp {
              gatsbyImageData(width: 40, placeholder: NONE)
            }
          }
          nativeCurrency {
            decimals
            name
            symbol
          }
          explorers {
            url
            name
            standard
          }
          status
          faucets
        }
      }
    }
  `);

  const chains = data.allChain.nodes;

  for (let c = [27483, 2748], i = 0, l = c.length; i < l; i++) {
    chains.unshift(
      chains.splice(
        chains.findIndex((item) => item.chainId === c[i]),
        1
      )[0]
    );
  }

  const { query, showTestnets, showDeprecated } = useContext(SearchContext);
  const lowerCaseQuery = query.toLowerCase();

  const handleFiltering = (chain) => {
    const lowerCaseName = chain.name.toLowerCase();
    const isTestnet =
      !showTestnets &&
      (chain.faucets.length > 0 || lowerCaseName.includes("testnet"));
    const isDeprecated = !showDeprecated && chain.status === "deprecated";
    if (isTestnet || isDeprecated) {
      return false;
    }
    if (query.length > 0) {
      return (
        chain.name.toLowerCase().includes(lowerCaseQuery) ||
        chain.chainId.toString().includes(query) ||
        chain.nativeCurrency.symbol.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return true;
  };

  const filteredChains = chains.filter(handleFiltering);

  return (
    <SimpleGrid minChildWidth="300px" spacing={4} mb="8">
      {filteredChains.map((c) => (
        <Chain key={c.id} {...c} />
      ))}
    </SimpleGrid>
  );
};
