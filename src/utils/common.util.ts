import { match } from 'path-to-regexp';



export const hidePhone = (phone?: string): string | undefined => {
  if (!phone) {
    return undefined;
  }

  return phone.replace(phone.slice(2, 7), '*****');
};



// find the matched route from the route permissions
export function findMatchedRoute(
  req: any,
  routePermissions: { method: string; path: string; permission: string }[]
) {
  for (const route of routePermissions) {
    if (route.method === req.method) {
      const matcher = match(route.path, { decode: decodeURIComponent });
      if (matcher(req.baseUrl + req.path)) {
        return route;
      }
    }
  }
  return null;
}