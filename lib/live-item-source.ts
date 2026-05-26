import { tarkovDevQuery } from "@/lib/tarkov-dev";

export interface LiveItemCategory {
  name?: string;
}

export interface LiveSellFor {
  vendor?: {
    name?: string;
  };

  price?: number;
}

export interface LiveItem {
  /*
    CORE
  */
  id: string;

  name: string;

  shortName?: string;

  description?: string;

  /*
    CATEGORY
  */
  categories?: LiveItemCategory[];

  /*
    ECONOMY
  */
  avg24hPrice?: number;

  low24hPrice?: number;

  high24hPrice?: number;

  lastLowPrice?: number;

  fleaMarketFee?: number;

  /*
    DIMENSIONS
  */
  width?: number;

  height?: number;

  weight?: number;

  /*
    MEDIA
  */
  iconLink?: string;

  image8xLink?: string;

  /*
    MARKET
  */
  sellFor?: LiveSellFor[];
}

interface LiveItemResponse {
  items?: LiveItem[];
}

export async function getLiveItems(): Promise<
  LiveItem[]
> {
  const query = `
{
  items {
    id

    name

    shortName

    description

    width

    height

    weight

    avg24hPrice

    low24hPrice

    high24hPrice

    lastLowPrice

    fleaMarketFee

    iconLink

    image8xLink

    categories {
      name
    }

    sellFor {
      price

      vendor {
        name
      }
    }
  }
}
`;

  const data: LiveItemResponse =
    await tarkovDevQuery(
      query
    );

  if (
    !data ||
    !Array.isArray(
      data.items
    )
  ) {
    console.error(
      "INVALID ITEM RESPONSE:",
      data
    );

    return [];
  }

  return data.items;
}