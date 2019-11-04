import File from '../models/File';

class FileController {
  async index(req, res) {
    const files = await File.findAll();

    return res.json(files);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    console.log(`${name} - ${path}`);

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
