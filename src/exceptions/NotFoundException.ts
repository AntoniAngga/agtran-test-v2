import HttpException from './HttpException';

class NotFoundException extends HttpException {
  constructor(id: string, tableName: string) {
    super(404, `${tableName} with id ${id} not found`);
  }
}

export default NotFoundException;
