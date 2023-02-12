const { REACT_APP_MARVEL_API_PUBLIC_KEY } = process.env;

class MarvelAPI {
  BASE_URL = 'https://gateway.marvel.com:443/v1/public';
  getCharacters = async () => {
    try {
      const resp = await fetch(
        `${this.BASE_URL}/characters?apikey=${REACT_APP_MARVEL_API_PUBLIC_KEY}&limit=9`
      );

      const { data } = await resp.json();
      return data;
    } catch (e) {
      console.log(e);
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
    }
  };

  _transformResponse = async res => {
    const name = res.name;
    const description = res.description;
    const homepage = res.urls[0].url;
    const wiki = res.urls[1].url;
    const pictureUrl = `${res.thumbnail.path}.${res.thumbnail.extension}`;

    return { name, description, homepage, wiki, pictureUrl };
  };
}

export default new MarvelAPI();
