import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { loadBrands, resetBrands } from '../model/brands-slice';
import { resetOffers } from '../../select-brand';

import { useDebounce } from '@/shared/lib/use-debounce';

export const SearchForm = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const debounced = useDebounce(value.trim(), 1000);

  useEffect(() => {
    dispatch(resetOffers());
    if (debounced) dispatch(loadBrands(debounced));
    else dispatch(resetBrands());
  }, [debounced, dispatch]);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      dispatch(resetOffers());
      dispatch(loadBrands(value.trim()));
    }
  };

  return (
    <form onSubmit={submit} className="input-group input-group-lg mb-3">
      <input
        className="form-control"
        placeholder="Введите артикул, например 11832АА031"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!value.trim()}
      >
        Найти
      </button>
    </form>
  );
};
