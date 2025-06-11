import PositionModel from '../models/position.model';
import UserModel from '../models/user.model';

class PositionService {
  // Lấy tất cả các chức vụ
  async getAllPositions() {
    return PositionModel.findAll();
  }

  // Lấy chức vụ theo id
  async getPositionById(id: number) {
    return PositionModel.findByPk(id);
  }

  // Kiểm tra chức vụ có tồn tại không
  async exists(id: number): Promise<boolean> {
    const count = await PositionModel.count({ where: { id } });
    return count > 0;
  }

  // (Tuỳ chọn) Lấy tất cả user thuộc một position
  async getUsersByPositionId(id: number) {
    return PositionModel.findByPk(id, {
      include: [{ model: UserModel, as: 'users' }]
    });
  }

  // Thêm mới position
  async createPosition(data: { name: string, description?: string }) {
    return PositionModel.create(data as any);
  }

  // Cập nhật position
  async updatePosition(id: number, data: { name?: string, description?: string }) {
    const position = await PositionModel.findByPk(id);
    if (!position) return null;
    await position.update(data);
    return position;
  }

  // Xóa position
  async deletePosition(id: number) {
    const deleted = await PositionModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new PositionService();
