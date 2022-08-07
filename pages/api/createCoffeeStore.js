import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {


  if (req.method === 'POST') {
    // find a record

    const { id, name, neighborhood, address, imgUrl, voting } = req.body;
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          // creating a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: 'Id or name is missing' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.error('Error Creating or Finding a Store', err);
      res.status(500);
      res.json({ message: 'Error Creating or Finding a Store', err });
    }
  }
};

export default createCoffeeStore;
