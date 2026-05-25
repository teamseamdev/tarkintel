import { tarkovDevQuery } from "@/lib/tarkov-dev";

export async function getLiveItems() {
  const query = `
    {
      items {
        id
        name
        shortName
        avg24hPrice
        iconLink
        fleaMarketFee
        categories {
          name
        }
      }
    }
  `;

  const data =
    await tarkovDevQuery(
      query
    );

  return data.items;
}