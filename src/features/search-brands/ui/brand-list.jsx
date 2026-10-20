import { useDispatch, useSelector } from 'react-redux';

import { loadOffers } from '../../select-brand';

import { Loader } from '@/shared/ui/loader';
import { ErrorAlert } from '@/shared/ui/error-alert';
import { EmptyState } from '@/shared/ui/empty-state';

export const BrandList = () => {
  const dispatch = useDispatch();
  const { number, items, status, error } = useSelector((s) => s.brands);
  const selected = useSelector((s) => s.offers.brand);

  if (status === 'idle') return null;
  if (status === 'loading') return <Loader text="Ищем производителей..." />;
  if (status === 'failed') return <ErrorAlert message={error} />;
  if (!items.length)
    return <EmptyState text={`По артикулу «${number}» ничего не найдено`} />;

  return (
    <div className="mb-4">
      <h5>Производители</h5>
      <div className="d-flex flex-wrap gap-2">
        {items.map((brand) => (
          <button
            key={brand}
            className={`btn ${
              brand === selected ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => dispatch(loadOffers({ number, brand }))}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};
