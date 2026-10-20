import { request } from '@/shared/api/client';

const isReal = (item) => item && (item.brand || item.name);

const getGoods = (data) =>
  (Array.isArray(data) ? data : (data?.goods ?? [])).filter(isReal);

function getPrice(item) {
  const warehouses = (item.warehouses ?? []).filter((w) => w.price > 0);
  const inStock = warehouses.filter((w) => w.stock > 0);
  const source = inStock.length ? inStock : warehouses;

  if (source.length) return Math.min(...source.map((w) => w.price));
  return item.price > 0 ? item.price : null;
}

function toOffer(item, isAnalogue) {
  return {
    id: `${item.goodsID}-${item.brand}-${item.number}`,
    brand: item.brand,
    number: item.number,
    name: item.name,
    price: getPrice(item),
    count: item.count ?? 0,
    isAnalogue,
  };
}

const byAvailability = (a, b) =>
  Number(b.count > 0) - Number(a.count > 0) ||
  (a.price ?? Infinity) - (b.price ?? Infinity);

// уникальный список производителей по артикулу
export async function fetchBrands(number, signal) {
  const data = await request({ number }, signal);
  return [
    ...new Set(
      getGoods(data)
        .map((g) => g.brand)
        .filter(Boolean)
    ),
  ];
}

// искомая позиция + аналоги
export async function fetchOffers(number, brand, signal) {
  const data = await request({ number, brand, analogues: 'on' }, signal);
  const main = [];
  const analogues = [];

  getGoods(data).forEach((item) => {
    main.push(toOffer(item, false));
    (item.analogues ?? [])
      .filter(isReal)
      .forEach((a) => analogues.push(toOffer(a, true)));
  });

  return [...main, ...analogues.sort(byAvailability)];
}
