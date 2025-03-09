import Writeable from "./writeable.js";

export const store = {
  catalog: new Writeable( [] ),
  favorites: new Writeable( [] ),
  recommendations: new Writeable( [] )
};
