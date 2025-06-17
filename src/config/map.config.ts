//config map permission
export const mapPermission: Record<string, string> = {
  // user routes 
    'GET /': 'view_user',
    'GET /:userId': 'view_user',
    'POST /': 'create_user',
    'PUT /:userId': 'update_user',
    'DELETE /:userId': 'delete_user',
    'GET /me': 'view_own_user',
    
    
    // salary routes 
    'GET /salary/me': 'view_own_salary',
    'GET /salary': 'view_salary', 
    'DELETE /salary/:id': 'delete_salary',
    'POST /salary': 'add_salary',
    'PUT /salary/:id': 'update_salary',
    
  };