import { useHttp } from '../hooks/useHttp';

const { REACT_APP_MARVEL_API_PUBLIC_KEY } = process.env;

export const useMarvelAPI = () => {
  const { state, getData, error } = useHttp();
  const BASE_URL = 'https://gateway.marvel.com:443/v1/public';

  const getCharacters = async (offset = 0) => {
    const data = await getData(
      `${BASE_URL}/characters?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}&limit=9&offset=${offset}`
    );

    return await Promise.all(data?.results.map(_transformChar));
  };

  const getCharacterByID = async id => {
    const data = await getData(
      `${BASE_URL}/characters/${id}?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}`
    );

    return _transformChar(data?.results[0]);
  };

  const getComicsData = async (offset = 0) => {
    const data = await getData(
      `${BASE_URL}/comics?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}&limit=8&offset=${offset}`
    );

    return await Promise.all(data?.results.map(_transformComics));
  };

  const getComicById = async id => {
    const data = await getData(
      `${BASE_URL}/comics/${id}?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}`
    );
    console.log(data);
    return _transformComics(data?.results[0]);
  };

  const _transformChar = async ({
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

  const _transformComics = async ({
    thumbnail,
    prices,
    id,
    title,
    pageCount,
    description,
    textObjects,
  }) => {
    const price = prices[0].price;
    const pictureUrl = `${thumbnail.path}.${thumbnail.extension}`;
    const language = textObjects[0]?.language;
    return {
      id,
      title,
      price: price ? `${price} $` : 'Price is unknown',
      pictureUrl,
      pageCount: pageCount ? `${pageCount} pages` : 'Number of pages unknown',
      language: language ? `Language: ${language}` : 'Language is unknown',
      description: description ? description : 'Description is missing',
    };
  };

  return {
    getComicsData,
    getCharacterByID,
    getComicById,
    getCharacters,
    state,
    error,
  };
};
