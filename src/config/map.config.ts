//config map permission
export const mapPermission: Record<string, string> = {
    'GET /': 'view_user',
    'GET /:userId': 'view_user',
    'POST /': 'create_user',
    'PUT /:userId': 'update_user',
    'DELETE /:userId': 'delete_user',
    'GET /salary': 'view_salary',
    'POST /salary': 'add_salary',
    'PUT /salary/:id': 'update_salary',
    'DELETE /salary/:id': 'delete_salary',
    'GET /me': 'view_own_user',
    'GET /salary/me': 'view_own_salary',
    // ... các API khác
  };