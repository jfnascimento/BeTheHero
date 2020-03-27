const connecton = require('../database/connection');
module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;
    const [count] = await connecton('incidents')
      .count();
    
    const incidents = await connecton('incidents')
      .join('ongs', 'ong_id', '=', 'incidents.ong_id')
      .limit(10)
      .offset((page - 1) * 10)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      ]);
    
    response.header('X-Total-Count', count['count(*)']);

    return response.json(incidents);
  },
      
  async create(request, response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connecton('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });
    
    return response.json({id});
  },

  async delete (request, response) {
    const {id} = request.params;
    const ong_id = request.headers.authorization;
    const incident = await connecton('incidents')
      .where('id', id)
      .select('ong_id')
      .first();
      
    if(incident.ong_id !== ong_id) {
      return response.status(401).json({error: 'Operation not permited'});
    }
    
    await connecton('incidents').where('id', id).delete();
    return response.status(204).send();
  }
}
