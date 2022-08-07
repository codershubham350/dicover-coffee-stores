import { fetchCoffeeStores } from '../../lib/coffee-stores';

const getCoffeeStoresByLocation = async (req, res) => {
  //configure latLong and limit
  try {
    const { latlong, limit } = req.query;
    const response = await fetchCoffeeStores(latlong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.error('There is an error', err);
    res.status(500);
    res.json({ message: 'Oh no! Something went wrong', err });
  }

  //return
};

export default getCoffeeStoresByLocation;
