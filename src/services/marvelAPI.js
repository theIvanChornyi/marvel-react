const { REACT_APP_MARVEL_API_PUBLIC_KEY } = process.env;

class MarvelAPI {
  BASE_URL = 'https://gateway.marvel.com:443/v1/public';
  getCharacters = async (offset = 0) => {
    try {
      const resp = await fetch(
        `${this.BASE_URL}/characters?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}&limit=9&offset=${offset}`
      );

      const { data } = await resp.json();
      const results = await Promise.all(
        data.results.map(this._transformResponse)
      );

      return results;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  getCharacterByID = async id => {
    try {
      const resp = await fetch(
        `${this.BASE_URL}/characters/${id}?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}`
      );

      const { data } = await resp.json();
      return this._transformResponse(data.results[0]);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  _transformResponse = async ({
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
}

export default new MarvelAPI();
