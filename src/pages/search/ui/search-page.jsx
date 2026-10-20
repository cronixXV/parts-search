import { SearchForm, BrandList } from '@/features/search-brands';
import { OffersTable } from '@/features/select-brand';

export const SearchPage = () => {
  return (
    <main className="container py-4" style={{ maxWidth: 900 }}>
      <h1 className="h3 mb-4">Поиск автозапчастей</h1>
      <SearchForm />
      <BrandList />
      <OffersTable />
    </main>
  );
};
