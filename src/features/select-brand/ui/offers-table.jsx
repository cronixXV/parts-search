import { useSelector } from 'react-redux';

import { Loader } from '@/shared/ui/loader';
import { ErrorAlert } from '@/shared/ui/error-alert';
import { EmptyState } from '@/shared/ui/empty-state';

const formatPrice = (p) =>
  p == null
    ? '—'
    : new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      }).format(p);

export const OffersTable = () => {
  const { brand, items, status, error } = useSelector((s) => s.offers);

  if (status === 'idle') return null;
  if (status === 'loading')
    return <Loader text="Загружаем предложения и аналоги..." />;
  if (status === 'failed') return <ErrorAlert message={error} />;
  if (!items.length)
    return <EmptyState text={`Для «${brand}» предложений не найдено`} />;

  return (
    <div>
      <h5>Предложения и аналоги</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Название / Производитель</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id}>
                <td>
                  <div className="fw-semibold">
                    {o.name || '—'}{' '}
                    <span
                      className={`badge ${
                        o.isAnalogue ? 'text-bg-secondary' : 'text-bg-success'
                      }`}
                    >
                      {o.isAnalogue ? 'аналог' : 'искомая'}
                    </span>
                  </div>
                  <div className="text-secondary small">
                    {o.brand} · {o.number}
                  </div>
                </td>
                <td
                  className={`text-end ${o.count > 0 ? '' : 'text-secondary'}`}
                >
                  {formatPrice(o.price)}
                </td>
                <td className={`text-end ${o.count > 0 ? '' : 'text-danger'}`}>
                  {o.count > 0 ? `${o.count} шт.` : 'нет в наличии'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
