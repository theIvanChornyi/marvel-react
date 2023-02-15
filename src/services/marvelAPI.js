import { useHttp } from '../hooks/useHttp';

const { REACT_APP_MARVEL_API_PUBLIC_KEY } = process.env;

export const useMarvelAPI = () => {
  const { state, getData, error } = useHttp();
  const BASE_URL = 'https://gateway.marvel.com:443/v1/public';

  const getCharacters = async (offset = 0) => {
    const data = await getData(
      `${BASE_URL}/characters?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}&limit=9&offset=${offset}`
    );

    return await Promise.all(data.results.map(_transformResponse));
  };

  const getCharacterByID = async id => {
    const data = await getData(
      `${BASE_URL}/characters/${id}?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}`
    );

    return _transformResponse(data.results[0]);
  };

  const _transformResponse = async ({
    id,
    thumbnail,
    name,
    urls,
    description = 'Nothing is known about this character.',
    comics,
  }) => {
    const homepage = urls[0].url;
    const wiki = urls[1].url;
    const pictureUrl = `${thumbnail.path}.${thumbnail.extension}`;

    return {
      id,
      name,
      description,
      homepage,
      wiki,
      pictureUrl,
      comics: comics.items,
    };
  };

  return { getCharacterByID, getCharacters, state, error };
};
