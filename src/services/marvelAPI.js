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
      return data;
    } catch (e) {
      console.log(e);
    }
  };
}

export default new MarvelAPI();
