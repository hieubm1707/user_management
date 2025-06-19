import PositionModel from '../models/position.model';
import UserModel from '../models/user.model';

class PositionService {
  // Get all positions
  async getAllPositions() {
    return PositionModel.findAll();
  }

  // Get position by id
  async getPositionById(id: number) {
    return PositionModel.findByPk(id);
  }

  // Check if position exists
  async exists(id: number): Promise<boolean> {
    const count = await PositionModel.count({ where: { id } });
    return count > 0;
  }

  // (Optional) Get all users belonging to a position
  async getUsersByPositionId(id: number) {
    return PositionModel.findByPk(id, {
      include: [{ model: UserModel, as: 'users' }]
    });
  }

  // Add new position
  async createPosition(data: { name: string, description?: string }) {
    return PositionModel.create(data as any);
  }

  // Update position
  async updatePosition(id: number, data: { name?: string, description?: string }) {
    const position = await PositionModel.findByPk(id);
    if (!position) return null;
    await position.update(data);
    return position;
  }

  // Delete position
  async deletePosition(id: number) {
    const deleted = await PositionModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new PositionService();
