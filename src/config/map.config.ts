//config map permission
export const mapPermission: Record<string, string> = {
  // user routes 
    'GET /users/filter': 'use_filter',               
    'GET /users': 'view_user',                        
    'GET /users/': 'view_user',
    'GET /users/me': 'view_own_user', 
    'GET /users/:userId': 'view_user',               
    'POST /users': 'create_user',                     
    'POST /users/': 'create_user',
    'PUT /users/:userId': 'update_user',             
    'DELETE /users/:userId': 'delete_user', 
    
    
    // salary routes 
    'GET /salary/me': 'view_own_salary',
    'GET /salary': 'view_all_salary',
    'GET /salary/': 'view_all_salary', 
    'GET /salary/sumsalary': 'sum_salary',
    'GET /salary/sumall': 'sum_salary',
    'GET /salary/filter': 'salary_filter',
    'GET /salary/:userId': 'view_salary_by_user',
    'GET /salary/:userId/:year/:month': 'view_salary_by_month',
    'POST /salary/:userId': 'add_salary',
    'PUT /salary/:userId/:year/:month': 'update_salary',
    'DELETE /salary/:userId/:year/:month': 'delete_salary',
    
  };